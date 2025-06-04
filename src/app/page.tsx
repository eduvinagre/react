import Game from '@/app/components/Game/Game';
import '@/styles/main.scss'; // Import global SASS styles

export default function HomePage() {
  return (
    <main>
      <h1>Unvoid Chess Game</h1>
      <Game />
    </main>
  );
}
