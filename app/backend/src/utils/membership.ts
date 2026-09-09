import { prisma } from "../db.js";
import { ApiError } from "../middleware/error.js";

// Dispatch, logistics and driving are roles held inside an organization,
// never standalone accounts — so every permission check goes through
// membership. The organization owner is always treated as ADMINISTRATEUR.
export async function membershipOrThrow(
  organizationId: string,
  userId: string,
  allowed: readonly string[],
) {
  const organization = await prisma.organization.findUnique({ where: { id: organizationId } });
  if (!organization) throw new ApiError(404, "ORGANIZATION_NOT_FOUND");

  if (organization.ownerId === userId) return { organization, role: "ADMINISTRATEUR" };

  const member = await prisma.organizationMember.findUnique({
    where: { organizationId_userId: { organizationId, userId } },
  });
  if (!member || !allowed.includes(member.role)) throw new ApiError(403, "FORBIDDEN");
  return { organization, role: member.role };
}

export async function isMemberOf(organizationId: string, userId: string, allowed: readonly string[]) {
  try {
    await membershipOrThrow(organizationId, userId, allowed);
    return true;
  } catch {
    return false;
  }
}
