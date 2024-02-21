import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

/**
 * Renders a popup dialog component.
 *
 * @param {Object} props - The component props.
 * @param {string} props.title - The title of the popup.
 * @param {ReactNode} props.children - The content of the popup.
 * @param {boolean} props.openPopup - Flag indicating whether the popup is open or not.
 * @param {function} props.setOpenPopup - Function to set the openPopup flag.
 * @returns {JSX.Element} The rendered Popup component.
 */
export default function Popup(props) {
  const { title, children, openPopup, setOpenPopup } = props;
  return (
    <Dialog open={openPopup} maxWidth="sm" fullWidth>
      <DialogTitle>
        <div>
          <Typography variant="h6" color="inital" component="div">
            {title}
          </Typography>
        </div>
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => {
          setOpenPopup(false);
        }}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>{children}</DialogContent>
    </Dialog>
  );
}
