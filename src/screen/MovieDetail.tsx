import React, { Fragment, FunctionComponent, useContext, useEffect, useState } from "react";
import {
  Alert,
  Image,
  ImageStyle,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TextStyle,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import IconFA from "react-native-vector-icons/FontAwesome";

import { Card, Spacer } from "../component";
import {
  addToWatchList,
  APIKey,
  getImageUrl,
  getMovieDetailUrl,
  getMovieReviewUrl,
  getMovieStateUrl,
  manipulateRating,
  Url,
} from "../config";
import { Context } from "../context/Context";
import {
  backgroundBlack,
  black,
  blue,
  blueWhite,
  green,
  red,
  sh16,
  sh20,
  sh216,
  sh24,
  sh240,
  sh256,
  sh32,
  sh4,
  sh48,
  sh600,
  sh648,
  sh8,
  sw1,
  sw16,
  sw2,
  sw24,
  sw32,
  sw344,
  sw368,
  sw384,
  sw4,
  sw416,
  sw7,
  sw8,
  white,
  yellow,
} from "../style";
import { alignCenter, br, bw, justifyCenter } from "../style/style";

export const MovieDetail: FunctionComponent<MovieDetailProp> = ({ navigation }: MovieDetailProp): JSX.Element => {
  const { selectedMovieID, sessionID } = useContext<IContextInput>(Context);
  const [movieDetail, setMovieDetail] = useState<IMovieDetail | undefined>(undefined);
  const [movieReviewList, setMovieReviewList] = useState<IMovieReview[] | undefined>(undefined);
  const [addedWatchList, setAddedWatchList] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(0);
  const [previousRating, setPreviousRating] = useState<number>(0);
  const [ratingSubmitted, setRatingSubmitted] = useState<boolean>(false);
  const [showMore, setShowMore] = useState<boolean>(false);
  const [selectedReview, setSelectedReview] = useState<number | null>(null);
  const ratingRange: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [showRate, setShowRate] = useState<boolean>(false);
  const [ref, setRef] = useState<Text | null>(null);
  const [lineCount, setLineCount] = useState<number[]>([]);

  const handleSetMovieReviewList = (newMovieReviewList: IMovieReview[]): void => {
    setMovieReviewList(newMovieReviewList);
  };

  const handleSetRating = (newRating: number): void => {
    if (newRating === rating) {
      setRating(0);
    } else {
      setRating(newRating);
    }
  };

  const handleAddToWatchListDB = async (): Promise<boolean> => {
    try {
      const response: IAddWatchListResponse = await (
        await fetch(`${addToWatchList}&session_id=${sessionID}`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            media_type: "movie",
            media_id: movieDetail?.id,
            watchlist: !addedWatchList,
          }),
        })
      ).json();
      return response.success ? true : false;
    } catch (err) {
      console.log("err", err);
      return false;
    }
  };

  const handleAddedWatchList = async (): Promise<void> => {
    const success: boolean = await handleAddToWatchListDB();
    if (success) {
      // if (addedWatchList) {
      //   // initially movie is in watchlist but now want to remove
      //   // Alert.alert("Success", "Removed from Watch List");
      // } else {
      //   // Alert.alert("Success", "Added to Watch List");
      // }
      setAddedWatchList(!addedWatchList);
    } else if (!success) {
      if (addedWatchList) {
        // initially movie is in watchlist but now want to remove
        Alert.alert("Failed", "unable to remove from Watch List");
      } else {
        Alert.alert("Failed", "unable to add to Watch List");
      }
    }
  };

  const handlePostRatingDB = async (): Promise<boolean> => {
    try {
      const response: IPostRatingResponse = await (
        await fetch(`${manipulateRating(selectedMovieID)}${sessionID}`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            value: rating,
          }),
        })
      ).json();
      return response.success ? true : false;
    } catch (err) {
      console.log("err", err);
      return false;
    }
  };

  const handleDeleteRatingDB = async (): Promise<boolean> => {
    try {
      const response: IDeleteRatingResponse = await (
        await fetch(`${manipulateRating(selectedMovieID)}${sessionID}`, {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
      ).json();
      return response.success ? true : false;
    } catch (err) {
      console.log("err", err);
      return false;
    }
  };

  const handleSetRatingSubmitted = async (): Promise<void> => {
    let success;
    if (rating !== 0) {
      if (rating !== previousRating) {
        success = await handlePostRatingDB();
        if (success) {
          // Alert.alert("Success!", "Added rating");
          setRatingSubmitted(true);
          setPreviousRating(rating);
        } else {
          Alert.alert("Failed!", "unable to add rating, please contact customer service");
        }
      }
    } else if (rating === 0) {
      if (ratingSubmitted) {
        success = await handleDeleteRatingDB();
        if (success) {
          // Alert.alert("Success!", "Deleted rating");
          setRatingSubmitted(false);
          setPreviousRating(rating);
        } else {
          Alert.alert("Failed!", "unable to delete rating, please contact customer service");
        }
      }
    }
  };

  const handleSetMovieDetail = (newMovieDetail: IMovieDetail) => {
    setMovieDetail(newMovieDetail);
  };

  const movieTitle: TextStyle = {
    fontSize: sh32,
    lineHeight: sh32,
    fontWeight: "bold",
    color: blue._1,
    flexWrap: "wrap",
    width: sw344,
    textShadowColor: black,
    textShadowOffset: { height: sw4, width: sw4 },
    textShadowRadius: 1,
  };

  const itemStyle: ViewStyle = {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "baseline",
  };

  const detailTitle: TextStyle = {
    color: green,
    fontSize: sh16,
    fontWeight: "500",
    lineHeight: sh16,
  };

  const detail: TextStyle = {
    color: white,
    fontSize: sh16,
    lineHeight: sh16,
  };

  const movieReviewCard: ViewStyle = {
    paddingHorizontal: sw8,
    marginHorizontal: sw8,
    paddingVertical: sh4,
    // marginBottom: sh8,
    backgroundColor: white,
    shadowOpacity: 0.5,
    width: sw368,
    height: sh240,
    borderRadius: br,
  };

  const reviewAuthor: TextStyle = {
    color: black,
    fontSize: sh20,
    fontWeight: "bold",
  };

  const reviewContent: TextStyle = {
    color: black,
    fontSize: sh16,
  };

  const ratingRow: ViewStyle = {
    flexDirection: "row",
    ...alignCenter,
    borderRadius: sw8,
    marginVertical: sw8,
    height: sh48,
  };

  const ratingStar: ImageStyle = {
    height: sh24,
    width: sw24,
    resizeMode: "stretch",
  };

  const functionButton: ViewStyle = {
    borderRadius: sw16,
    backgroundColor: white,
    margin: sw1,
    marginTop: sh4,
    height: sw32,
    width: sw32,
    ...alignCenter,
    ...justifyCenter,
  };

  const iconStyle: ImageStyle = {
    height: sw24,
    width: sw24,
    tintColor: black,
    // backgroundColor: green,
    // borderWidth: 2,
  };

  const handleStyle = (index: number, listLength: number): ViewStyle => {
    switch (index) {
      case 0:
        return { ...movieReviewCard, marginLeft: sw24 };
      case listLength - 1:
        return { ...movieReviewCard, marginRight: sw24 };
      default:
        return movieReviewCard;
    }
  };

  const handleDisplayReview = (movieReviewList: IMovieReview[] | undefined) => {
    if (movieReviewList === undefined) {
      return <Text style={{ color: white }}>Loading...</Text>;
    } else if (movieReviewList !== undefined) {
      if (movieReviewList.length === 0) {
        return <Text style={{ color: white }}>No Review for this movie yet</Text>;
      } else {
        return (
          <ScrollView
            bounces={false}
            snapToInterval={sw384}
            decelerationRate={"fast"}
            disableIntervalMomentum={true}
            nestedScrollEnabled={true}
            horizontal={true}
            style={{ borderRadius: br, height: sh216 }}
            contentContainerStyle={{ flexDirection: "row", minWidth: "100%", backgroundColor: black }}>
            {movieReviewList.map((review, index) => {
              return (
                <Card key={index} style={handleStyle(index, movieReviewList.length)}>
                  <View style={{ borderRadius: br }}>
                    <Text style={reviewAuthor}>{review.author}:</Text>
                    <Text
                      numberOfLines={lineCount[index] === undefined ? 0 : lineCount[index]}
                      onTextLayout={(e) => {
                        e.nativeEvent.lines.length > 11 ? setLineCount(lineCount.concat(11)) : setLineCount(lineCount.concat(0));
                      }}
                      style={reviewContent}>
                      {review.content}
                    </Text>
                    {lineCount[index] === 11 ? (
                      <Text
                        onPress={() => {
                          setShowMore(true);
                          setSelectedReview(index);
                        }}
                        style={{
                          fontSize: sh16,
                          color: blue._2,
                          position: "absolute",
                          right: 0,
                          bottom: 0,
                          backgroundColor: white,
                          shadowColor: white,
                          shadowOpacity: 1,
                          shadowOffset: { height: 0, width: -sw16 },
                          shadowRadius: 5,
                        }}>
                        more...
                      </Text>
                    ) : null}
                  </View>
                </Card>
              );
            })}
          </ScrollView>
        );
      }
    }
  };

  const handleFetchMovieDetail = async (): Promise<void> => {
    try {
      const jsonResponse: IMovieDetail = await (await fetch(`${Url}${getMovieDetailUrl}${selectedMovieID}?api_key=${APIKey}`)).json();
      handleSetMovieDetail(jsonResponse);
    } catch (err) {
      console.log("err", err);
    }
  };

  const handleFetchMovieStates = async (): Promise<void> => {
    try {
      const jsonResponse: IMovieState = await (
        await fetch(`${Url}${getMovieStateUrl(selectedMovieID)}?api_key=${APIKey}&session_id=${sessionID}`)
      ).json();
      setAddedWatchList(jsonResponse.watchlist);

      if (typeof jsonResponse.rated === "object") {
        handleSetRating(jsonResponse.rated.value);
        setPreviousRating(jsonResponse.rated.value);
        setRatingSubmitted(true);
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  const handleFetchMovieReviews = async (): Promise<void> => {
    try {
      const jsonResponse: IMovieReviewListResponse = await (
        await fetch(`${Url}${getMovieReviewUrl(selectedMovieID)}?api_key=${APIKey}&session_id=${sessionID}`)
      ).json();
      handleSetMovieReviewList(jsonResponse.results);
    } catch (err) {
      console.log("err", err);
    }
  };

  useEffect((): void => {
    handleFetchMovieDetail();
    handleFetchMovieStates();
    handleFetchMovieReviews();
  }, []);

  return (
    <SafeAreaView edges={["top", "bottom"]} style={{ backgroundColor: backgroundBlack, ...alignCenter, ...justifyCenter }}>
      <StatusBar barStyle={"light-content"} />
      {movieDetail !== undefined ? (
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          style={{ backgroundColor: backgroundBlack, paddingHorizontal: sw7, width: "100%" }}>
          <IconFA
            name="arrow-circle-o-left"
            size={sw32}
            color={white}
            style={{
              zIndex: 1,
              margin: sw8,
              position: "absolute",
              alignSelf: "flex-start",
              shadowOpacity: 1,
              shadowOffset: { height: sw2, width: sw2 },
              shadowColor: black,
              shadowRadius: 0.5,
            }}
            onPress={() => {
              navigation.goBack();
            }}
          />

          <Image
            source={{ uri: `${getImageUrl}${movieDetail.poster_path}` }}
            resizeMode="stretch"
            style={{ height: sh648, width: sw416, borderRadius: sw32 }} // 1.618 is golden ratio
          ></Image>

          <Spacer height={sh8} />

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={movieTitle}>{movieDetail.title}</Text>
            <View style={{ flexDirection: "row" }}>
              <View style={functionButton}>
                <IconFA
                  size={sw24}
                  name={addedWatchList ? "bookmark" : "bookmark-o"}
                  // color={addedWatchList ? yellow : black}
                  style={{
                    shadowColor: black,
                    shadowOffset: { height: sw1, width: sw1 },
                    shadowOpacity: 1,
                    shadowRadius: 1,
                    color: addedWatchList ? red : black,
                  }}
                  onPress={handleAddedWatchList}
                />
              </View>
              <View style={functionButton}>
                <IconFA
                  size={sw24}
                  name={ratingSubmitted ? "star" : "star-o"}
                  // color={ratingSubmitted ? yellow : black}
                  style={{
                    shadowColor: black,
                    shadowOffset: { height: sw1, width: sw1 },
                    shadowOpacity: 1,
                    shadowRadius: 1,
                    color: ratingSubmitted ? yellow : black,
                  }}
                  onPress={() => {
                    setShowRate(true);
                  }}
                />
              </View>
            </View>
          </View>

          <Spacer height={sh4}></Spacer>

          <View style={itemStyle}>
            <Text style={detailTitle}>Language: </Text>
            <Text style={detail}>{movieDetail.original_language.toUpperCase()}</Text>
            <Text style={{ ...detailTitle, marginLeft: "auto" }}>Rating: </Text>
            <Text style={{ ...detail, marginRight: "auto" }}>{movieDetail.vote_average}</Text>
          </View>

          <Spacer height={sh4}></Spacer>

          <View style={itemStyle}>
            <Text style={detailTitle}>Release Date: </Text>
            <Text style={detail}>{movieDetail.release_date}</Text>
          </View>

          <Spacer height={sh4}></Spacer>

          <Text style={detailTitle}>Overview:</Text>
          <View style={itemStyle}>
            <Text style={detail}>{movieDetail.overview}</Text>
          </View>

          <Spacer height={sh4}></Spacer>

          <View style={{ height: movieReviewList === undefined || movieReviewList.length === 0 ? "auto" : sh256 }}>
            <Text style={detailTitle}>Review: </Text>
            {handleDisplayReview(movieReviewList)}
          </View>

          {selectedReview !== null && (
            <Modal animationType="fade" transparent={true} visible={showMore}>
              <TouchableWithoutFeedback
                onPress={() => {
                  setShowMore(false);
                }}>
                <View
                  style={{
                    position: "absolute",
                    height: "100%",
                    width: "100%",
                    backgroundColor: "rgba(90,90,90,0.7)",
                  }}></View>
              </TouchableWithoutFeedback>
              <View
                style={{
                  ...alignCenter,
                  ...justifyCenter,
                  alignSelf: "center",
                  backgroundColor: green,
                  borderColor: black,
                  borderRadius: br,
                  borderWidth: bw,
                  height: "auto",
                  marginBottom: "auto",
                  marginTop: "auto",
                  padding: sw8,
                  width: "80%",
                  shadowOffset: { height: sh16, width: sw16 },
                  shadowColor: black,
                  shadowOpacity: 1,
                  shadowRadius: 2,
                }}>
                {movieReviewList !== undefined ? (
                  <Fragment>
                    <Text style={{ ...reviewAuthor, color: black }}>{movieReviewList[selectedReview].author}:</Text>
                    <ScrollView style={{ height: sh600 }}>
                      <Text style={{ ...reviewContent, color: black }}>{movieReviewList[selectedReview].content}</Text>
                    </ScrollView>
                  </Fragment>
                ) : null}
              </View>
            </Modal>
          )}

          <Modal animationType="fade" transparent={true} visible={showRate}>
            <TouchableWithoutFeedback
              onPress={() => {
                setShowRate(false);
                handleSetRatingSubmitted();
              }}>
              <View
                style={{
                  position: "absolute",
                  height: "100%",
                  width: "100%",
                }}></View>
            </TouchableWithoutFeedback>
            <View
              style={{
                ...alignCenter,
                ...justifyCenter,
                alignSelf: "center",
                backgroundColor: backgroundBlack,
                borderColor: blueWhite,
                borderRadius: br,
                borderWidth: bw,
                height: "auto",
                marginBottom: "auto",
                marginTop: "auto",
                padding: sw8,
                width: "80%",
              }}>
              <Text style={detailTitle}>Rate the Movie </Text>
              <View style={ratingRow}>
                {ratingRange.map((item, index) => {
                  return (
                    // <TouchableOpacity
                    //   style={{ borderRadius: sw16, backgroundColor: white, padding: sw2, margin: sw1 }}
                    //   // disabled={ratingSubmitted}
                    //   key={index}
                    //   onPress={() => handleSetRating(item)}>
                    //   <Image
                    //     style={ratingStar}
                    //     source={item <= rating ? require("./MovieDetail/filledStar.png") : require("./MovieDetail/nonFilledStar.png")}
                    //   />
                    // </TouchableOpacity>
                    <View key={index} style={{ borderRadius: sw16, backgroundColor: white, padding: sw2, margin: sw1 }}>
                      <IconFA
                        size={sw24}
                        name={item <= rating ? "star" : "star-o"}
                        style={{
                          shadowColor: black,
                          shadowOffset: { height: sw1, width: sw1 },
                          shadowOpacity: 1,
                          shadowRadius: 1,
                          color: item <= rating ? yellow : black,
                        }}
                        onPress={() => {
                          handleSetRating(item);
                        }}
                      />
                    </View>
                  );
                })}
              </View>
            </View>
          </Modal>
        </ScrollView>
      ) : (
        <Text>Loading...</Text>
      )}
    </SafeAreaView>
  );
};
