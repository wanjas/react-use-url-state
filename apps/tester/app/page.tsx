import Link from 'next/link';
import styles from './page.module.css';

export default async function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.css file.
   */
  return (
    <div className={styles.page}>
      <div className="wrapper">
        <div className="container">
          <div id="welcome">
            <h1>
              <span> Hello there, </span>
              Welcome tester 👋
            </h1>

            <Link href="/state">To state</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
