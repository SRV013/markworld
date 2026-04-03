import type { Group } from "../../types/worldCup";
import styles from "./GroupPicker.module.css";

const POSITION_LABEL = ["1°", "2°", "3°"];
const POSITION_CLASS = [styles.gold, styles.silver, styles.bronze];

interface GroupPickerProps {
  group: Group;
  selected: string[]; // ['1°team', '2°team', '3°team']
  onToggle: (teamName: string) => void;
}

export function GroupPicker({ group, selected, onToggle }: GroupPickerProps) {
  const allFilled = selected.length === 3;
  const getFlagUrl = (code: string) =>
    `https://flagcdn.com/w40/${code.toLowerCase()}.png`;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.groupLabel}>Grupo</span>
        <span className={styles.groupId}>{group.id}</span>
      </div>

      <p className={styles.hint}>
        Elegí en orden: primero, segundo y tercer clasificado
      </p>

      <ul className={styles.list}>
        {group.teams.map((team) => {
          const posIdx = selected.indexOf(team.name);
          const isPicked = posIdx !== -1;
          const isEliminated = allFilled && !isPicked;

          return (
            <li key={team.name}>
              <button
                className={`${styles.teamBtn} ${isPicked ? styles.picked : ""} ${isEliminated ? styles.eliminated : ""}`}
                onClick={() => onToggle(team.name)}
                aria-pressed={isPicked}
              >
                <img src={getFlagUrl(team.code)} alt={team.name} width={20} />

                {/* <span className={styles.flag}>{team.flag}</span> */}
                <span className={styles.name}>{team.name}</span>

                {isPicked && (
                  <span className={`${styles.badge} ${POSITION_CLASS[posIdx]}`}>
                    {POSITION_LABEL[posIdx]}
                  </span>
                )}
                {isEliminated && (
                  <span className={styles.badgeOut}>Eliminado</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
