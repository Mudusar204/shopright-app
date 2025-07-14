import React from "react";
import CustomLocationSearch from "./CustomLocationSearch";

interface LocationInputHandlerProps {
  placeholder?: string;
  onLocationSelect: (data: any, details: any) => void;
  leftIcon?: React.ReactNode;
}

const LocationInputHandler = ({
  placeholder = "Search location",
  onLocationSelect,
  leftIcon,
}: LocationInputHandlerProps) => {
  return (
    <CustomLocationSearch
      placeholder={placeholder}
      onLocationSelect={onLocationSelect}
      leftIcon={leftIcon}
    />
  );
};

export default LocationInputHandler;
