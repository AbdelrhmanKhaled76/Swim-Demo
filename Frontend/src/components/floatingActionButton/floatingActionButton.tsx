import Button from "../button/button";

interface props {
  onClick: () => void;
}

function FloatingActionButton({ onClick }: props) {
  return (
    <>
      <Button
        onClick={onClick}
        className="fixed bottom-30 lg:bottom-10 right-10 z-50 flex h-14 w-14 items-center justify-center"
      >
        +
      </Button>

    </>
  );
}

export default FloatingActionButton;
