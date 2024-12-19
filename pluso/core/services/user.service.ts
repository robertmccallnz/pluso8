import { supabaseAdmin } from "../database/supabase/client.ts";
import { Database } from "../database/schema/types.ts";

type User = Database["public"]["Tables"]["users"]["Row"];
type UserInsert = Database["public"]["Tables"]["users"]["Insert"];
type UserUpdate = Database["public"]["Tables"]["users"]["Update"];

export class UserService {
  static async createUser(userData: UserInsert): Promise<User | null> {
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .insert([userData])
      .select()
      .single();

    if (error) {
      console.error("Error creating user:", error);
      return null;
    }

    return user;
  }

  static async createTrialUser(email: string): Promise<User | null> {
    const trialStart = new Date().toISOString();
    const trialEnd = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 minutes

    const userData: UserInsert = {
      email,
      role: "trial",
      subscription_status: "trial",
      trial_start: trialStart,
      trial_end: trialEnd,
      created_at: trialStart,
      updated_at: trialStart,
    };

    return await this.createUser(userData);
  }

  static async getUserById(id: string): Promise<User | null> {
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select()
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching user:", error);
      return null;
    }

    return user;
  }

  static async updateUser(id: string, updates: UserUpdate): Promise<User | null> {
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating user:", error);
      return null;
    }

    return user;
  }

  static async isTrialValid(userId: string): Promise<boolean> {
    const user = await this.getUserById(userId);
    if (!user || user.subscription_status !== "trial") return false;

    const now = new Date();
    const trialEnd = user.trial_end ? new Date(user.trial_end) : null;
    return trialEnd ? now < trialEnd : false;
  }

  static async getTrialTimeRemaining(userId: string): Promise<number> {
    const user = await this.getUserById(userId);
    if (!user || user.subscription_status !== "trial" || !user.trial_end) return 0;

    const now = new Date();
    const trialEnd = new Date(user.trial_end);
    const remaining = trialEnd.getTime() - now.getTime();
    return Math.max(0, Math.floor(remaining / 1000)); // Return remaining seconds
  }

  static async recordAnalytics(userId: string, eventType: string, eventData: any): Promise<void> {
    const { error } = await supabaseAdmin.from("user_analytics").insert({
      user_id: userId,
      event_type: eventType,
      event_data: eventData,
      created_at: new Date().toISOString(),
      platform: eventData.platform || null,
      device: eventData.device || null,
      session_id: eventData.session_id || null,
    });

    if (error) {
      console.error("Error recording analytics:", error);
    }
  }

  static async linkAgentToUser(userId: string, agentId: string): Promise<void> {
    const { error } = await supabaseAdmin.from("user_agents").insert({
      user_id: userId,
      agent_id: agentId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error linking agent to user:", error);
    }
  }
}
