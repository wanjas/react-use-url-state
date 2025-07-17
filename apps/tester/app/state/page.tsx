import Link from 'next/link';
import { StateChanger } from '../../components/StateChanger';

export default async function Index() {
  return (
    <div>
      <h1>Welcome to tester!</h1>

      <Link href="/state2">To another state</Link>
      <br />
      <Link href="/state-initial">To initial state</Link>

      <StateChanger />
    </div>
  );
}
