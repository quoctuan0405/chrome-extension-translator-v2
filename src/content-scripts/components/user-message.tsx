import { motion } from "motion/react";
import { Response } from "../../components/response";

type Props = {
  children?: string;
};

export const UserMessage: React.FC<Props> = ({ children }) => {
  return (
    <motion.div
      className="ml-auto bg-neutral-100 px-4 py-1 rounded-xl max-w-fit w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 1 }}
    >
      <Response>{children}</Response>
    </motion.div>
  );
};
