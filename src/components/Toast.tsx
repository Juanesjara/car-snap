interface Props {
  message: string;
}

export function Toast({ message }: Props) {
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-5 py-3 rounded-full text-sm font-medium shadow-lg animate-fade-in">
      {message}
    </div>
  );
}
