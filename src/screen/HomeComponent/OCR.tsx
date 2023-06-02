import "react-native-reanimated";

import moment from "moment";
import React, { useEffect, useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { Camera, CameraDevice, CameraDevices, useCameraDevices, useFrameProcessor } from "react-native-vision-camera";
import { OCRFrame, scanOCR } from "vision-camera-ocr";

import { Loader, Spacer } from "../../component";
import { DICTIONARY_PLACE_OF_BIRTH } from "../../dictionary";
import { alignCenter, br, justifyCenter, sh16, sh256, sh272, sh4, sh64, sw16, sw400, sw416, sw8, white } from "../../style";
import { CornerMarker } from "./CornerMarker";
import { runOnJS } from "react-native-reanimated";

interface IOCRProps {
  closeCam: () => void;
}

export const OCR = ({ closeCam }: IOCRProps): JSX.Element => {
  const frontMessage: string = "Please use a Malaysia ID card and place the front side within the box";
  const backMessage: string = "Please use a Malaysia ID card and place the back side within the box";

  const devices: CameraDevices = useCameraDevices();
  const device: CameraDevice | undefined = devices.back;
  const [active, setActive] = useState<boolean>(true);
  const [displayMessage, setDisplayMessage] = useState<string>(frontMessage);
  const [frontPassed, setFrontPassed] = useState<boolean>(false);
  const [backPassed, setBackPassed] = useState<boolean>(false);
  // const [test, setTest] = useState<string>("");
  const [validDate, setValidDate] = useState<boolean>(false);

  const NRIC_DATE_FORMAT = "YYMMDD";
  const initialNRICData: INRICData = {
    address: "",
    city: "",
    country: "Malaysia",
    DOB: "",
    gender: "female",
    IDNumber: "",
    name: "",
    placeOfBirth: "",
    postcode: "",
    state: "",
  };
  const [NRICData, setNRICData] = useState<INRICData>(initialNRICData);

  type TData = "date" | "name";

  const processData = (caseType: TData, data: string) => {
    if (caseType === "date") {
      NRICData.address = data;
      console.log("this is the last try and the answer is :", NRICData.address);
    }
  };

  const date = (date: string) => {
    return moment(date, "YYMMDD");
  };

  // const abc = (inp: string, ut: string) => {
  //   // console.log(inp + ut);
  //   setTest(inp);
  //   // console.log(moment("971024", "YYMMDD"));
  //   console.log("ic num", NRICData.IDNumber);
  //   NRICData.IDNumber = ut;
  //   console.log("after: ", NRICData.IDNumber);
  // };

  const checkValidDate = async (date: string) => {
    console.log("input to validDate", date, validDate);
    if (moment(date, NRIC_DATE_FORMAT).isValid()) {
      await setValidDate(true);
      console.log("NRIC address before", NRICData.address);
      NRICData.address = date;
      await setNRICData({ ...NRICData, address: date });
      console.log("NRIC address after", NRICData.address);
    }
  };

  // closeCam();

  // console.log("82010".match("^([0-9]){5}$"));
  // console.log("971024-01-6077".match("^([0-9]){6}-([0-9]){2}-([0-9]){4}$"));

  const checkValidIC = (scanResult: OCRFrame, NRICData: INRICData) => {
    // console.log("inside of check valid ic!");
    if (scanResult.result.blocks.length > 0) {
      if (!frontPassed) {
        if (scanResult.result.text.toLowerCase().includes("mykad")) {
          scanResult.result.blocks.forEach((textBlock: ITextBlock, blockIndex: number) => {
            // console.log(`block ${index}: `, textBlock.text);
            // console.log(scanResult.result.text);
            // console.log("Block", index, ": ", textBlock.text);
            textBlock.lines.forEach((textLine: ITextLine, lineIndex: number) => {
              textLine.elements.forEach((element: ITextElement, elementIndex: number) => {
                // console.log(`element ${elementIndex} :`, element.text);
                if (element.text.match("^([0-9]){6}-([0-9]){2}-([0-9]){4}$")) {
                  // console.log("matched id format ");
                  // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                  // console.log("abstracted ic 6 digit: ", element.text.substring(0, 6));
                  // processData("date", element.text.substring(0, 6));
                  // runOnJS(checkValidDate)(element.text.substring(0, 6));
                  // console.log("the answer!!!!!!!: ", NRICData.IDNumber);
                  // console.log("test!!!!!: ", test);
                  // console.log("validDate", validDate);
                  // console.log("address", NRICData.address);
                  if (moment(element.text.substring(0, 6), NRIC_DATE_FORMAT).isValid()) {
                    // console.log("valid id date");
                    const capturedDate = moment(element.text.substring(0, 6), NRIC_DATE_FORMAT);
                    const placeOfBirth: ILocation | undefined = DICTIONARY_PLACE_OF_BIRTH.find(
                      (location) => location.code === element.text.substring(7, 9),
                    );
                    // console.log("ID num: ", element.text);
                    // console.log("name: ", scanResult.result.blocks[blockIndex + 1].text);

                    setNRICData({
                      ...NRICData,
                      IDNumber: element.text,
                      placeOfBirth: placeOfBirth ? placeOfBirth.location : "",
                      name: scanResult.result.blocks[blockIndex + 1].text,
                      DOB: capturedDate.isAfter()
                        ? capturedDate.subtract(100, "years").format("YYYY-MM-DD")
                        : capturedDate.format("YYYY-MM-DD"),
                    });
                  }
                } else if (element.text.match("^([0-9]){5}$")) {
                  // console.log("matched postcode");
                  // console.log(textLine.elements[elementIndex].text);
                  setNRICData({
                    ...NRICData,
                    postcode: element.text,
                    address: textBlock.text,
                    city: textLine.text.substring(6),
                    state: textBlock.lines[lineIndex + 1].text,
                  });
                } else if (element.text.toLowerCase() === "lelaki") {
                  // console.log("matched gender");
                  setNRICData({
                    ...NRICData,
                    gender: "male",
                  });
                }
              });
            });
          });
          // console.log(NRICData);
          // Object.keys(NRICData).forEach((key) => {
          //   console.log(`${key}: ${NRICData[key as keyof INRICData]}`);
          // });
          if (!Object.values(NRICData).includes("")) {
            setFrontPassed(true);
            setDisplayMessage(backMessage);
            Object.keys(NRICData).forEach((key) => {
              console.log(`${key}: ${NRICData[key as keyof INRICData]}`);
            });
          }
        }
      } else if (frontPassed && !backPassed) {
        if (scanResult.result.text.toLocaleLowerCase().includes("pendaftaran negara")) {
          console.log("this is back!");
          setBackPassed(true);
          console.log("after set");
          console.log(backPassed);
        }
      } else if (frontPassed && backPassed) {
        // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        closeCam();
      }
    }
  };

  const frameProcessor = useFrameProcessor(
    (frame) => {
      "worklet";
      const scanResult: OCRFrame = scanOCR(frame);
      runOnJS(checkValidIC)(scanResult, NRICData);
      // console.log(runOnJS(date)("971024"));
      // runOnJS(abc)("ajsjsjs", "aaaa");
      // console.log(abc());
      // if (scanResult.result.blocks.length > 0) {
      //   if (!frontPassed) {
      //     if (scanResult.result.text.toLowerCase().includes("mykad")) {
      //       // console.log(scanResult.result.text);
      //       scanResult.result.blocks.forEach((textBlock: ITextBlock, index: number) => {
      //         textBlock.lines.forEach((textLine: ITextLine) => {
      //           textLine.elements.forEach((element: ITextElement, index: number) => {
      //             if (element.text.match("^([0-9]){6}-([0-9]){2}-([0-9]){4}$")) {
      //               console.log("matched ic");
      //               // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      //               console.log("abstracted ic 6 digit: ", element.text.substring(0, 6));
      //               // processData("date", element.text.substring(0, 6));
      //               runOnJS(checkValidDate)(element.text.substring(0, 6));
      //               // console.log("the answer!!!!!!!: ", NRICData.IDNumber);
      //               // console.log("test!!!!!: ", test);

      //                 console.log("validDate", validDate);
      //                 console.log("address", NRICData.address);

      //               if (validDate) {
      //                 console.log("matched ic date");
      //                 const capturedDate = moment(element.text.substring(0, 6), NRIC_DATE_FORMAT);
      //                 NRICData.DOB = moment(capturedDate).isAfter() ? capturedDate.subtract(100, "years").toDate() : capturedDate.toDate();
      //                 const placeOfBirth: ILocation | undefined = DICTIONARY_PLACE_OF_BIRTH.find(
      //                   (location) => location.code === element.text.substring(7, 9),
      //                 );
      //                 placeOfBirth ? (NRICData.placeOfBirth = placeOfBirth.location) : null;
      //                 NRICData.IDNumber = element.text;
      //                 NRICData.name = textLine.elements[index + 1];
      //                 console.log("updating the value!!!!");
      //               } else if (element.text.match("[0-9]{5}")) {
      //                 console.log("matched postcode");
      //                 NRICData.address = textBlock.text;
      //                 NRICData.city = textLine.elements[index + 1];
      //                 NRICData.state = textLine.elements[index + 2];
      //               } else if (element.text.toLowerCase() === "lelaki") {
      //                 console.log("matched gender");
      //                 NRICData.gender = "male";
      //               }
      //             }
      //           });
      //         });
      //       });
      //       // Object.keys(NRICData).forEach((key) => {
      //       //   console.log(`${key}: ${NRICData[key as keyof INRICData]}`);
      //       // });
      //       if (!Object.values(NRICData).includes("") && !Object.values(NRICData).includes(undefined)) {
      //         setFrontPassed(true);
      //         setDisplayMessage(backMessage);
      //         Object.keys(NRICData).forEach((key) => {
      //           console.log(`${key}: ${NRICData[key as keyof INRICData]}`);
      //         });
      //       }
      //     }
      //   } else if (frontPassed && !backPassed) {
      //     if (scanResult.result.text.toLocaleLowerCase().includes("pendaftaran negara")) {
      //       console.log("this is back!");
      //       setBackPassed(true);
      //     }
      //   } else if (frontPassed && backPassed) {
      //     closeCam;
      //   }
      //   // console.log("this is test", test);
      // }
    },
    [NRICData, frontPassed, backPassed],
  );

  if (!device) return <Loader />;
  return (
    <Modal transparent={true} visible={true}>
      <View
        style={{
          position: "absolute",
          height: "100%",
          width: "100%",
          backgroundColor: "rgba(90,90,90,0.7)",
        }}
      />
      <View style={{ ...alignCenter, ...justifyCenter, marginTop: "auto", marginBottom: "auto" }}>
        <Text style={{ fontSize: sh16 }}>{displayMessage}</Text>
        {/* <Text>test should appear: {test}</Text> */}
        <Spacer height={sh4} />

        <CornerMarker color={white} height={sh272} width={sw416} borderLength={sh64} thickness={sw8} borderRadius={sw16}>
          <Camera
            frameProcessor={frameProcessor}
            style={{ height: sh256, width: sw400, borderRadius: br }}
            device={device}
            isActive={active}
            frameProcessorFps={60}
          />
        </CornerMarker>

        <Spacer height={sh4} />

        <TouchableOpacity style={{ borderWidth: 2 }} onPress={() => setActive(!active)}>
          <Text>Click me!</Text>
        </TouchableOpacity>
        <Spacer height={sh4} />

        <TouchableOpacity style={{ borderWidth: 2 }} onPress={closeCam}>
          <Text>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};
