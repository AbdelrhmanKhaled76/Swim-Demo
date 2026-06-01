function Sign({ title }: { title: string }) {
  return (
    <p className="flex w-sm text-center justify-center items-center p-6 text-4xl text-secondary-800 font-bold bg-white rounded-sm">
      {title}
    </p>
  );
}

export default Sign;
