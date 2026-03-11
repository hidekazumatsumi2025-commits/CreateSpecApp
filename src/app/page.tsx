import styles from "./page.module.css";
import SpecGenerator from "./spec-generator";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.brand}>
            <div className={styles.mark} aria-hidden="true" />
            <div>
              <div className={styles.title}>Spec Seeder</div>
              <div className={styles.subtitle}>
                抽象要求を分解して、仕様駆動開発のmdを生成します
              </div>
            </div>
          </div>
          <div className={styles.hint}>
            サーバーに <code>OPENAI_API_KEY</code> が必要です
          </div>
        </header>

        <SpecGenerator />
      </main>
    </div>
  );
}
