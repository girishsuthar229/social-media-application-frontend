import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  DialogActions,
} from "@mui/material";
import { X } from "lucide-react";
import React from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}
const CommonDialogModal = ({ open, onClose, children, title }: ModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="common-modal-dialog"
      maxWidth="lg"
      fullWidth
    >
      <DialogActions className="post-dialog-action">
        <Box className="drawer-header">
          <Typography variant="h6" className="drawer-title">
            {title}
          </Typography>
          <IconButton className="drawer-close-btn" onClick={onClose}>
            <X size={20} />
          </IconButton>
        </Box>
      </DialogActions>
      <DialogContent className="post-modal-container scrollbar">
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default CommonDialogModal;
