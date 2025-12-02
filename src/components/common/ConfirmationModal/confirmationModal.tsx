import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import { X } from "lucide-react";

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
      <DialogContent className="common-model-header" sx={{ padding: 1 }}>
        <Typography variant="h6" sx={{ flex: 1 }} />
        <IconButton className="drawer-close-btn" onClick={onClose}>
          <X size={20} />
        </IconButton>
      </DialogContent>
      <DialogContent className="deny-common-content">
        <Box sx={{ mt: 2, mb: 3 }}>
          <div>{content}</div>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{ justifyContent: "space-between", padding: "0 16px 16px" }}
      >
        {denyButton && (
          <Button
            className="deny-common-button"
            variant="outlined"
            color="primary"
            onClick={denyButton.onClick}
            sx={{ paddingX: 3, paddingY: 1 }}
          >
            <Typography variant="button">{denyButton.buttonText}</Typography>
          </Button>
        )}

        {confirmButton && (
          <Button
            className="confirm-common-button"
            variant="contained"
            color="primary"
            onClick={confirmButton.onClick}
            sx={{ paddingX: 3, paddingY: 1 }}
          >
            <Typography variant="button">{confirmButton.buttonText}</Typography>
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
