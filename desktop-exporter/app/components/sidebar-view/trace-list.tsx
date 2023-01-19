import React, { useRef } from "react";
import { VariableSizeList } from "react-window";
import { NavLink, useLocation } from "react-router-dom";
import {
  Flex,
  LinkBox,
  LinkOverlay,
  Divider,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useSize } from "@chakra-ui/react-use-size";

import { TraceSummaryWithUIData } from "../../types/ui-types";

const sidebarItemHeightWithRoot = 120;
const sidebarItemHeightWithoutRoot = 80;
const dividerHeight = 1;

type SidebarRowData = {
  selectedTraceID: string;
  traceSummaries: TraceSummaryWithUIData[];
};

type SidebarRowProps = {
  index: number;
  style: Object;
  data: SidebarRowData;
};

function SidebarRow({ index, style, data }: SidebarRowProps) {
  let { selectedTraceID, traceSummaries } = data;
  let traceSummary = traceSummaries[index];

  let isSelected =
    selectedTraceID && selectedTraceID === traceSummary.traceID ? true : false;

  let backgroundColour = isSelected
    ? useColorModeValue("pink.50", "pink.900")
    : "";

  let dividerColour = useColorModeValue("blackAlpha.300", "whiteAlpha.300");

  if (traceSummary.hasRootSpan) {
    // Add zero-width space after forward slashes, dashes, and dots
    // to indicate line breaking opportunity
    let rootNameLabel = traceSummary.rootName
      .replaceAll("/", "/\u200B")
      .replaceAll("-", "-\u200B")
      .replaceAll(".", ".\u200B");

    let rootServiceNameLabel = traceSummary.rootServiceName
      .replaceAll("/", "/\u200B")
      .replaceAll("-", "-\u200B")
      .replaceAll(".", ".\u200B");

    return (
      <div style={style}>
        <Divider
          height={dividerHeight}
          borderColor={dividerColour}
        />
        <LinkBox
          display="flex"
          flexDirection="column"
          justifyContent="center"
          bgColor={backgroundColour}
          height={`${sidebarItemHeightWithRoot}px`}
          paddingX="20px"
        >
          <Text
            fontSize="xs"
            noOfLines={1}
          >
            {"Root Service Name: "}
            <strong>{rootServiceNameLabel}</strong>
          </Text>
          <Text
            fontSize="xs"
            noOfLines={2}
          >
            {"Root Name: "}
            <strong>{rootNameLabel}</strong>
          </Text>
          <Text fontSize="xs">
            {"Root Duration: "}
            <strong>{traceSummary.rootDurationString}</strong>
          </Text>
          <Text fontSize="xs">
            {"Number of Spans: "}
            <strong>{traceSummary.spanCount}</strong>
          </Text>
          <LinkOverlay
            as={NavLink}
            to={`traces/${traceSummary.traceID}`}
          >
            <Text fontSize="xs">
              {"Trace ID: "}
              <strong>{traceSummary.traceID}</strong>
            </Text>
          </LinkOverlay>
        </LinkBox>
      </div>
    );
  }

  return (
    <div style={style}>
      <Divider
        height={dividerHeight}
        borderColor={dividerColour}
      />
      <LinkBox
        display="flex"
        flexDirection="column"
        justifyContent="center"
        bgColor={backgroundColour}
        height={`${sidebarItemHeightWithoutRoot}px`}
        paddingX="20px"
      >
        <Text fontSize="xs">
          {"Incomplete Trace: "}
          <strong>{"missing a root span"}</strong>
        </Text>
        <Text fontSize="xs">
          {"Number of Spans: "}
          <strong>{traceSummary.spanCount}</strong>
        </Text>
        <LinkOverlay
          as={NavLink}
          to={`traces/${traceSummary.traceID}`}
        >
          <Text fontSize="xs">
            {"Trace ID: "}
            <strong>{traceSummary.traceID}</strong>
          </Text>
        </LinkOverlay>
      </LinkBox>
    </div>
  );
}

type TraceListProps = {
  traceSummaries: TraceSummaryWithUIData[];
};

export function TraceList(props: TraceListProps) {
  let ref = useRef(null);
  let size = useSize(ref);
  let location = useLocation();
  let { traceSummaries } = props;

  let selectedTraceID = location ? location.pathname.split("/")[2] : "";
  let itemData = {
    selectedTraceID: selectedTraceID,
    traceSummaries: traceSummaries,
  };

  let getItemHeight = (index: number) =>
    traceSummaries[index].hasRootSpan
      ? sidebarItemHeightWithRoot + dividerHeight
      : sidebarItemHeightWithoutRoot + dividerHeight;

  return (
    <Flex
      ref={ref}
      height="100%"
    >
      <VariableSizeList
        height={size ? size.height : 0}
        itemData={itemData}
        itemCount={props.traceSummaries.length}
        itemSize={getItemHeight}
        width="100%"
      >
        {SidebarRow}
      </VariableSizeList>
    </Flex>
  );
}