function Sign({ title }: { title: string }) {
  const words = title.split(/\s+/).filter(Boolean);

  return (
    <p className="text-[#7A3626] font-bold text-lg md:text-2xl text-center leading-tight relative z-10 inter drop-shadow-sm">
      {words.map((word, index) => (
        <span key={index}>
          {word}
          {index !== words.length - 1 && <br />}
        </span>
      ))}
    </p>
  );
}

export default Sign;
