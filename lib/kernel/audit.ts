export type AuditEventName =
  | "creator.content.viewed_by_manager"
  | "creator.profile.updated"
  | "creator.content.published"
  | "platform.capability.activated"
  | "private_video.join_denied"
  | "private_video.join_authorized";

export interface AuditEvent {
  eventName: AuditEventName;
  actorId: string;
  targetType: "creator" | "content" | "capability" | "session";
  targetId: string;
  details?: Readonly<Record<string, string | number | boolean>>;
}
