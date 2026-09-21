import {
  UserRound,
  Pencil,
} from "lucide-react";

function ProfileHeader({
  profile,
  onEdit,
}) {
  const initials = profile.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2);

  return (
    <section className="rounded-[22px] bg-success-bg p-5 lg:p-6">

      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

        {/* Avatar */}
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-card text-brand text-2xl font-bold">

          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt={profile.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span>{initials}</span>
          )}

        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">

          <p className="text-xs font-medium text-text-muted">
            Welcome back
          </p>

          <h1 className="mt-1 truncate text-xl font-semibold text-text-primary lg:text-2xl">
            {profile.name}
          </h1>

          <p className="mt-1 truncate text-sm text-text-muted">
            {profile.email}
          </p>

        </div>

        {/* Edit */}
        <button
          type="button"
          onClick={onEdit}
          className="
            inline-flex
            h-10
            items-center
            justify-center
            gap-2
            rounded-[12px]
            bg-surface-card
            px-4
            text-xs
            font-semibold
            text-success-text
            transition
            hover:bg-surface-page
          "
        >
          <Pencil size={15} />

          Edit Profile
        </button>

      </div>

    </section>
  );
}

export default ProfileHeader;
