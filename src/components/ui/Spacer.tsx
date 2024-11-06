type SpacerProps = {
    size: string;
  };
  
const Spacer: React.FC<SpacerProps> = ({ size }) => (
    <div style={{ height: size }} />
);

export default Spacer;