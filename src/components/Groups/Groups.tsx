import type { Group, Confederation } from "../../types/worldCup";
import styles from "./Groups.module.css";

const CONF_LABEL: Record<Confederation, string> = {
  UEFA: "UEFA",
  CONMEBOL: "CONMEBOL",
  CONCACAF: "CONCACAF",
  CAF: "CAF",
  AFC: "AFC",
  OFC: "OFC",
};

interface GroupCardProps {
  group: Group;
}

const getFlagUrl = (code:string) =>
  `https://flagcdn.com/w40/${code.toLowerCase()}.png`;

function GroupCard({ group }: GroupCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.groupLabel}>Grupo</span>
        <span className={styles.groupId}>{group.id}</span>
      </div>
      <ul className={styles.teamList}>
        {group.teams.map((team) => (
          <li key={team.name} className={styles.teamRow}>
            {/* <span className={styles.flag}>{team.flag}</span> */}
            <img src={getFlagUrl(team.code)} alt={team.name} width={20} />
            <span className={styles.teamName}>{team.name}</span>
            <span className={styles.conf}>
              {CONF_LABEL[team.confederation]}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface GroupsProps {
  groups: Group[];
}

export function Groups({ groups }: GroupsProps) {
  return (
    <div className={styles.grid}>
      {groups.map((group) => (
        <GroupCard key={group.id} group={group} />
      ))}
    </div>
  );
}
