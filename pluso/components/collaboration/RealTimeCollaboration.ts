import { EventEmitter } from 'events';

interface CollaborationUser {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  status: 'online' | 'away' | 'offline';
  lastActive: string;
}

interface CollaborationEvent {
  id: string;
  type: string;
  userId: string;
  timestamp: string;
  data: any;
}

interface Comment {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
  attachments?: string[];
  replies?: Comment[];
}

export class RealTimeCollaboration extends EventEmitter {
  private users: Map<string, CollaborationUser> = new Map();
  private cursors: Map<string, { x: number; y: number }> = new Map();
  private selections: Map<string, { start: number; end: number }> = new Map();
  private comments: Map<string, Comment[]> = new Map();
  private history: CollaborationEvent[] = [];

  constructor() {
    super();
    this.setupHeartbeat();
  }

  private setupHeartbeat(): void {
    setInterval(() => {
      this.users.forEach(user => {
        const lastActive = new Date(user.lastActive).getTime();
        const now = new Date().getTime();
        
        if (now - lastActive > 5 * 60 * 1000) { // 5 minutes
          this.updateUserStatus(user.id, 'away');
        }
      });
    }, 60 * 1000); // Check every minute
  }

  addUser(user: CollaborationUser): void {
    this.users.set(user.id, user);
    this.emit('userJoined', user);
    this.logEvent({
      id: `event_${Date.now()}`,
      type: 'user_joined',
      userId: user.id,
      timestamp: new Date().toISOString(),
      data: user
    });
  }

  removeUser(userId: string): void {
    const user = this.users.get(userId);
    if (user) {
      this.users.delete(userId);
      this.cursors.delete(userId);
      this.selections.delete(userId);
      this.emit('userLeft', user);
      this.logEvent({
        id: `event_${Date.now()}`,
        type: 'user_left',
        userId,
        timestamp: new Date().toISOString(),
        data: user
      });
    }
  }

  updateUserStatus(userId: string, status: CollaborationUser['status']): void {
    const user = this.users.get(userId);
    if (user) {
      user.status = status;
      user.lastActive = new Date().toISOString();
      this.users.set(userId, user);
      this.emit('userStatusChanged', { userId, status });
    }
  }

  updateCursor(userId: string, position: { x: number; y: number }): void {
    this.cursors.set(userId, position);
    this.emit('cursorMoved', { userId, position });
  }

  updateSelection(userId: string, range: { start: number; end: number }): void {
    this.selections.set(userId, range);
    this.emit('selectionChanged', { userId, range });
  }

  addComment(nodeId: string, comment: Comment): void {
    if (!this.comments.has(nodeId)) {
      this.comments.set(nodeId, []);
    }
    this.comments.get(nodeId)?.push(comment);
    this.emit('commentAdded', { nodeId, comment });
    this.logEvent({
      id: `event_${Date.now()}`,
      type: 'comment_added',
      userId: comment.userId,
      timestamp: new Date().toISOString(),
      data: { nodeId, comment }
    });
  }

  replyToComment(nodeId: string, parentCommentId: string, reply: Comment): void {
    const comments = this.comments.get(nodeId);
    if (comments) {
      const parentComment = comments.find(c => c.id === parentCommentId);
      if (parentComment) {
        if (!parentComment.replies) {
          parentComment.replies = [];
        }
        parentComment.replies.push(reply);
        this.emit('commentReplied', { nodeId, parentCommentId, reply });
      }
    }
  }

  getActiveUsers(): CollaborationUser[] {
    return Array.from(this.users.values()).filter(
      user => user.status !== 'offline'
    );
  }

  getUserCursor(userId: string): { x: number; y: number } | undefined {
    return this.cursors.get(userId);
  }

  getUserSelection(userId: string): { start: number; end: number } | undefined {
    return this.selections.get(userId);
  }

  getComments(nodeId: string): Comment[] {
    return this.comments.get(nodeId) || [];
  }

  private logEvent(event: CollaborationEvent): void {
    this.history.push(event);
    this.emit('historyUpdated', this.history);
  }

  getHistory(): CollaborationEvent[] {
    return this.history;
  }

  // Presence indicators
  startUserTyping(userId: string): void {
    this.emit('userTyping', { userId, typing: true });
  }

  stopUserTyping(userId: string): void {
    this.emit('userTyping', { userId, typing: false });
  }

  // Conflict resolution
  resolveConflict(
    nodeId: string,
    conflictingChanges: any[],
    resolution: any
  ): void {
    this.emit('conflictResolved', { nodeId, conflictingChanges, resolution });
    this.logEvent({
      id: `event_${Date.now()}`,
      type: 'conflict_resolved',
      userId: 'system',
      timestamp: new Date().toISOString(),
      data: { nodeId, conflictingChanges, resolution }
    });
  }
}
