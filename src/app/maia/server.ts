import { config } from "https://deno.land/x/dotenv/mod.ts";
import { Anthropic } from "npm:@anthropic-ai/sdk";

const yamlContent = await Deno.readTextFile("./src/app/maia/maia.yml");





interface EmailConfig {
  to: string;
  subject: string;
  content: string;
}

interface FollowUpSchedule {
  emailDetails: EmailConfig;
  sendDate: Date;
}

class EmailService {
  private apiKey: string;
  private baseUrl = "https://api.resend.com/emails";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async sendEmail(to: string, subject: string, content: string) {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Maia <maia@pluso.ai>",
        to: [to],
        subject: subject,
        html: content,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send email: ${response.statusText}`);
    }

    return await response.json();
  }
}

class MaiaServer {
  private anthropic: Anthropic;
  private config: any;
  private emailService: EmailService;
  private followUpQueue: FollowUpSchedule[] = [];

  constructor() {
    this.initializeServices();
  }

  private async initializeServices() {
    const env = await config();

    // Initialize Anthropic
    this.anthropic = new Anthropic({
      apiKey: env["ANTHROPIC_API_KEY"],
    });

    // Load Maia's configuration
    const yamlContent = await Deno.readTextFile("./maia/maia.yml");
    this.config = parse(yamlContent);

    // Initialize EmailService
    this.emailService = new EmailService(env["RESEND_API_KEY"]);
  }

  private async scheduleFollowUps(clientEmail: string, businessDetails: any) {
    const schedules = [
      { delay: 60 * 60 * 1000 },        // 1 hour
      { delay: 7 * 24 * 60 * 60 * 1000 },   // 1 week
      { delay: 14 * 24 * 60 * 60 * 1000 },  // 2 weeks
      { delay: 28 * 24 * 60 * 60 * 1000 },  // 4 weeks
    ];

    for (const schedule of schedules) {
      const sendDate = new Date(Date.now() + schedule.delay);
      this.followUpQueue.push({
        emailDetails: {
          to: clientEmail,
          subject: this.config.email_templates.client_follow_up.subject,
          content: this.generateFollowUpContent(businessDetails, schedule.delay),
        },
        sendDate,
      });
    }
  }

  private async processFollowUpQueue() {
    setInterval(async () => {
      const now = new Date();
      const emailsToSend = this.followUpQueue.filter(
        (schedule) => schedule.sendDate <= now
      );

      for (const email of emailsToSend) {
        await this.emailService.sendEmail(
          email.emailDetails.to,
          email.emailDetails.subject,
          email.emailDetails.content,
        );
        // Remove sent email from queue
        this.followUpQueue = this.followUpQueue.filter((e) => e !== email);
      }
    }, 60000); // Check every minute
  }

  private generateFollowUpContent(businessDetails: any, delay: number) {
    // Implement follow-up content generation based on delay and business context
    return ""; // Placeholder
  }

  async handleChat(req: Request): Promise<Response> {
    const { messages, businessDetails } = await req.json();

    const response = await this.anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      system: this.config.system_prompt,
      messages: messages,
    });

    if (businessDetails?.email) {
      // Schedule follow-up sequence
      await this.scheduleFollowUps(businessDetails.email, businessDetails);

      // Send immediate notification to PluSO
      await this.emailService.sendEmail(
        "hello@robertmccall.co.nz",
        `New PluSO Inquiry: ${businessDetails.name} - ${businessDetails.industry}`,
        this.generateProspectNotification(businessDetails, messages),
      );
    }

    return new Response(JSON.stringify(response), {
      headers: { "Content-Type": "application/json" },
    });
  }

  private generateProspectNotification(businessDetails: any, conversation: any[]) {
    // Implement prospect notification content generation
    return ""; // Placeholder
  }

  async start(port: number) {
    this.processFollowUpQueue(); // Start follow-up processor

    Deno.serve({ port }, async (req) => {
      if (req.method === "POST") {
        return await this.handleChat(req);
      }
      return new Response("Method not allowed", { status: 405 });
    });
  }
}

// Start server
const maiaServer = new MaiaServer();
await maiaServer.start(3001);
