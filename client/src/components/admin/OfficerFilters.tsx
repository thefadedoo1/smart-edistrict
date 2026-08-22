interface Props {
  search: string;
  setSearch: (value: string) => void;

  role: string;
  setRole: (value: string) => void;
}

export default function OfficerFilters({
  search,
  setSearch,
  role,
  setRole,
}: Props) {
  return (
    <div className="rounded-xl bg-white p-4 shadow">

      <div className="grid gap-4 md:grid-cols-2">

        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="rounded-lg border p-3"
        />

        <select
          value={role}
          onChange={(e) =>
            setRole(e.target.value)
          }
          className="rounded-lg border p-3"
        >
          <option value="">
            All Roles
          </option>

          <option value="DA">
            DA
          </option>

          <option value="PATWARI">
            PATWARI
          </option>

          <option value="TEHSILDAR">
            TEHSILDAR
          </option>

        </select>

      </div>

    </div>
  );
}