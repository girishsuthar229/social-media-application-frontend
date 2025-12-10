import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import React from "react";
import { X } from "lucide-react";
import BackButton from "../BackButton";

interface IButtonProps {
  onClick?: () => void;
  buttonText: string;
}

interface IConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  content: React.ReactNode;
  confirmButton?: IButtonProps;
  denyButton?: IButtonProps;
  className?: string;
}

const ConfirmationDialog = ({
  open,
  onClose,
  content,
  confirmButton,
  denyButton,
  className,
}: IConfirmationModalProps) => {
  return (
    <Dialog open={open} onClose={onClose} className={className}>
      <DialogTitle className="common-modal-title">
        <IconButton className="drawer-close-btn" onClick={onClose}>
          <X size={20} />
        </IconButton>
      </DialogTitle>
      <DialogContent className="common-dialog-content">
        <Typography component={'div'} className="confirmation-modal-content">
          {content}
        </Typography>
      </DialogContent>
      <DialogActions className="common-dialog-action">
        {denyButton && (
          <BackButton
            onClick={denyButton.onClick}
            labelText={denyButton.buttonText}
            showIcon={false}
            underlineOnHover={false}
          />
        )}

        {confirmButton && (
          <BackButton
            onClick={confirmButton.onClick}
            labelText={confirmButton.buttonText}
            showIcon={true}
            iconName="remove-person-icon"
            underlineOnHover={false}
            className="unfollow-btn"
          />
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
