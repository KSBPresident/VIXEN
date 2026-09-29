export type AuditEventName =
  | "creator.content.viewed_by_manager"
  | "creator.profile.updated"
  | "creator.content.published"
  | "platform.capability.activated";

export interface AuditEvent {
  eventName: AuditEventName;
  actorId: string;
  targetType: "creator" | "content" | "capability";
  targetId: string;
  details?: Readonly<Record<string, string | number | boolean>>;
}
