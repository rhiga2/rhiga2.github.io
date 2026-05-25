import { useState } from 'preact/hooks';

export default function Greeting({messages}) {

  const randomMessage = () => messages[(Math.floor(Math.random() * messages.length))];

  const [greeting, setGreeting] = useState(messages[0]);

  return (
    <div class="flex items-center gap-3 mt-4">
      <span class="text-gray-600 text-sm">{greeting}! Thank you for visiting!</span>
      <button
        onClick={() => setGreeting(randomMessage())}
        class="text-xs border border-gray-300 rounded px-2 py-1 hover:border-gray-500 transition-colors cursor-pointer"
      >
        New Greeting
      </button>
    </div>
  );
}
