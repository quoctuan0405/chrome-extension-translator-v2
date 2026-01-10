import { motion } from "motion/react";
import { Response } from "../../components/response";

type Props = {
  children?: string;
};

export const AIMessage: React.FC<Props> = ({ children }) => {
  return (
    <motion.div
      className="px-4 py-1 max-w-fit w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 1 }}
    >
      <Response>{children}</Response>
    </motion.div>
  );
};
