export const Timer = ({ seconds }) => (
  <div className={`text-6xl font-bold mb-6 ${seconds <= 5? 'text-red-500 animate-pulse' : 'text-yellow-500'}`}>
    {seconds}s
  </div>
)