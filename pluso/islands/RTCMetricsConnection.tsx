import { useEffect, useState } from "preact/hooks";

interface RTCMetricsConnectionProps {
  onMetricsUpdate: (data: any) => void;
}

export default function RTCMetricsConnection({ onMetricsUpdate }: RTCMetricsConnectionProps) {
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const [dataChannel, setDataChannel] = useState<RTCDataChannel | null>(null);

  useEffect(() => {
    const initializeRTC = async () => {
      try {
        // Create peer connection with STUN servers for NAT traversal
        const pc = new RTCPeerConnection({
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
          ],
        });

        // Create data channel
        const channel = pc.createDataChannel('metrics', {
          ordered: true,
          maxRetransmits: 3,
        });

        // Set up channel event handlers
        channel.onopen = () => {
          console.log('RTC Data Channel opened');
          // Request initial metrics
          channel.send(JSON.stringify({ type: 'request_metrics' }));
        };

        channel.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            onMetricsUpdate(data);
          } catch (error) {
            console.error('Error parsing metrics data:', error);
          }
        };

        channel.onerror = (error) => {
          console.error('Data Channel Error:', error);
        };

        // Set up peer connection event handlers
        pc.onicecandidate = async (event) => {
          if (event.candidate) {
            try {
              // Send the ICE candidate to the signaling server
              await fetch('/api/rtc/candidate', {
                method: 'POST',
                body: JSON.stringify({
                  candidate: event.candidate,
                }),
              });
            } catch (error) {
              console.error('Error sending ICE candidate:', error);
            }
          }
        };

        pc.onconnectionstatechange = () => {
          console.log('Connection state:', pc.connectionState);
          if (pc.connectionState === 'failed') {
            // Attempt to reconnect
            initializeRTC();
          }
        };

        // Create and send offer
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        // Send offer to signaling server
        const response = await fetch('/api/rtc/offer', {
          method: 'POST',
          body: JSON.stringify({
            sdp: pc.localDescription,
          }),
        });

        // Handle answer from server
        const { sdp: answerSdp } = await response.json();
        await pc.setRemoteDescription(new RTCSessionDescription(answerSdp));

        setPeerConnection(pc);
        setDataChannel(channel);
      } catch (error) {
        console.error('Error initializing WebRTC:', error);
      }
    };

    initializeRTC();

    // Cleanup
    return () => {
      if (dataChannel) {
        dataChannel.close();
      }
      if (peerConnection) {
        peerConnection.close();
      }
    };
  }, []);

  return null; // This is a non-visual component
}
