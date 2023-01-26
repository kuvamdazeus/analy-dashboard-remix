import {
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import { Form } from "@remix-run/react";
import { FiBox, FiGlobe } from "react-icons/fi";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function CreateProjectModal({ open, setOpen }: Props) {
  return (
    <Modal isCentered isOpen={open} onClose={() => setOpen(false)}>
      <ModalOverlay />

      <ModalContent p="5">
        <Box>
          <p className="text-xl font-semibold italic mb-7">Create a New Project</p>

          <Form method="post">
            <InputGroup>
              <InputLeftElement color="gray.500">
                <FiBox />
              </InputLeftElement>

              <Input isRequired name="name" placeholder="Twitter Inc." autoFocus />
            </InputGroup>

            <InputGroup mt="3">
              <InputLeftElement color="gray.500">
                <FiGlobe />
              </InputLeftElement>

              <Input isRequired name="url" placeholder="twitter.com" />
            </InputGroup>

            <center>
              <Button type="submit" w="full" bg="green.400" color="white" mt="7">
                Create
              </Button>
            </center>
          </Form>
        </Box>
      </ModalContent>
    </Modal>
  );
}
