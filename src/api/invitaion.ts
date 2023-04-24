import { ApiConfig } from ".";

export type Invitaition = {
  code: string;
  expire_at: string;
};

// ---------------- CreateInvitation ---------------- //
export type CreateInvitationRequest = {
  length: number;
  days: number;
};
export type CreateInvitationResponse = {
  invitation: Invitaition;
};
export const CreateInvitationConfig: ApiConfig<CreateInvitationResponse, CreateInvitationRequest> = {
  url: "/api/invitation",
  method: "POST",
};

// ---------------- CreateInvitation ---------------- //
export type DeleteInvitationsRequest = {
  codes: string[];
};
export const DeleteInvitationsConfig: ApiConfig<{}, DeleteInvitationsRequest> = {
  url: "/api/invitation",
  method: "DELETE",
};

// ---------------- CreateInvitation ---------------- //
export type ListInvitationsRequest = {
  page_id?: number;
  page_size?: number;
};
export type ListInvitationsResponse = {
  total: number;
  invitations: Invitaition[];
};
export const ListInvitationsConfig: ApiConfig<ListInvitationsResponse, ListInvitationsRequest> = {
  url: "/api/invitation",
  method: "GET",
};
