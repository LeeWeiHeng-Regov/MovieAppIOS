import React, { Fragment, FunctionComponent, useContext, useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  ImageStyle,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";
import { scale } from "react-native-size-matters";

import { Card } from "../component";
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
import { backgroundBlack, black, blue, blueWhite, green, red, white, yellow } from "../style";
import { alignCenter, justifyCenter } from "../style/style";

export const MovieDetail: FunctionComponent<MovieDetailProp> = ({ navigation }: MovieDetailProp): JSX.Element => {
  const { selectedMovieID, sessionID } = useContext<IContextInput>(Context);
  const [movieDetail, setMovieDetail] = useState<IMovieDetail | undefined>(undefined);
  const [movieReviewList, setMovieReviewList] = useState<IMovieReview[] | undefined>(undefined);
  const [addedWatchList, setAddedWatchList] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(3);
  const [ratingSubmitted, setRatingSubmitted] = useState<boolean>(false);
  const [showMore, setShowMore] = useState<boolean>(false);
  const ratingRange: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [showRate, setShowRate] = useState<boolean>(false);

  const handleSetMovieReviewList = (newMovieReviewList: IMovieReview[]): void => {
    setMovieReviewList(newMovieReviewList);
  };

  const handleShowMore = (): void => {
    setShowMore(!showMore);
  };

  const handleSetRating = (newRating: number): void => {
    setRating(newRating);
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
      if (addedWatchList) {
        // initially movie is in watchlist but now want to remove
        Alert.alert("Success", "Removed from Watch List");
      } else {
        Alert.alert("Success", "Added to Watch List");
      }
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
    let success: boolean;
    if (ratingSubmitted) {
      // if there is rating already and you want to remove it
      success = await handleDeleteRatingDB();
      if (success) {
        Alert.alert("Success!", "rating deleted");
        setRatingSubmitted(!ratingSubmitted);
      } else {
        Alert.alert("Failed!", "unable to delete rating");
      }
    } else {
      success = await handlePostRatingDB();
      if (success) {
        Alert.alert("Success!", "Added rating");
        setRatingSubmitted(!ratingSubmitted);
      } else {
        Alert.alert("Failed!", "unable to add rating");
      }
    }
  };

  const handleSetMovieDetail = (newMovieDetail: IMovieDetail) => {
    setMovieDetail(newMovieDetail);
  };

  const movieTitle: TextStyle = {
    fontSize: 30,
    fontWeight: "bold",
    color: blue._1,
    flexWrap: "wrap",
    width: "80%",
  };

  const detailTitle: TextStyle = {
    color: green,
    fontSize: 20,
    fontWeight: "bold",
  };

  const detail: TextStyle = {
    color: yellow,
    fontSize: 20,
  };

  const itemStyle: ViewStyle = {
    flexDirection: "row",
    flexWrap: "wrap",
  };

  const overviewDetail: TextStyle = {
    color: yellow,
    fontSize: 18,
    lineHeight: 20,
  };

  const movieReviewCard: ViewStyle = {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
    backgroundColor: yellow,
  };

  const reviewAuthor: TextStyle = {
    color: black,
    fontSize: 18,
    fontWeight: "bold",
  };

  const reviewContent: TextStyle = {
    color: black,
    fontSize: 15,
  };

  const ratingRow: ViewStyle = {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    borderRadius: 10,
    marginVertical: 24,
  };

  const ratingStar: ImageStyle = {
    height: scale(20),
    width: scale(20),
    resizeMode: "stretch",
  };

  const functionButton: ViewStyle = {
    borderRadius: 50,
    backgroundColor: yellow,
    margin: 1,
    marginTop: 5,
    height: scale(30),
    width: scale(30),
    ...alignCenter,
    ...justifyCenter,
  };

  const submitRatingButton: ViewStyle = {
    borderWidth: 2,
    borderRadius: 10,
    ...justifyCenter,
    ...alignCenter,
    alignSelf: "center",
    backgroundColor: ratingSubmitted ? red : blue._2,
    marginBottom: 5,
    width: 250,
  };

  const handleDisplayReview = (movieReviewList: IMovieReview[] | undefined) => {
    if (movieReviewList === undefined) {
      return <Text style={{ color: white }}>Loading...</Text>;
    } else if (movieReviewList !== undefined && movieReviewList.length === 0) {
      return <Text style={{ color: white }}>No Review for this movie yet</Text>;
    } else {
      return movieReviewList.map((review, index) => {
        return (
          <Card key={index} style={movieReviewCard}>
            <Fragment>
              <Text style={reviewAuthor}>By {review.author}: </Text>
              <Text style={reviewContent}>{review.content}</Text>
            </Fragment>
          </Card>
        );
      });
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
    <SafeAreaView style={{ backgroundColor: backgroundBlack, ...alignCenter, ...justifyCenter }}>
      <StatusBar barStyle={"light-content"} />
      {movieDetail !== undefined ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          style={{ backgroundColor: backgroundBlack, paddingHorizontal: 10 }}>
          <Image
            source={{ uri: `${getImageUrl}${movieDetail.poster_path}` }}
            resizeMode="stretch"
            style={{ height: (Dimensions.get("window").width - 20) * 1.618, width: "100%", borderRadius: 32 }} // 1.618 is golden ratio
          />

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={movieTitle}>{movieDetail.title}</Text>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity style={functionButton} onPress={handleAddedWatchList}>
                <Image
                  source={addedWatchList ? require("./MovieDetail/filledBookmark.png") : require("../asset/nonFilledBookmark.png")}
                  style={ratingStar}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={functionButton}
                onPress={() => {
                  setShowRate(true);
                }}>
                <Image
                  source={ratingSubmitted ? require("./MovieDetail/filledStar.png") : require("./MovieDetail/nonFilledStar.png")}
                  style={ratingStar}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={itemStyle}>
            <Text style={detailTitle}>Language: </Text>
            <Text style={detail}>{movieDetail.original_language}</Text>
            <Text style={{ ...detailTitle, marginLeft: "auto" }}>Rating: </Text>
            <Text style={{ ...detail, marginRight: "auto" }}>{movieDetail.vote_average}</Text>
          </View>

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
                }}></View>
            </TouchableWithoutFeedback>
            <View
              style={{
                ...alignCenter,
                ...justifyCenter,
                alignSelf: "center",
                backgroundColor: backgroundBlack,
                borderColor: blueWhite,
                borderRadius: 8,
                borderWidth: 2,
                height: "auto",
                marginBottom: "auto",
                marginTop: "auto",
                padding: 8,
                width: "80%",
              }}>
              <Text style={detailTitle}>Overview: </Text>
              <Text style={detail}>{movieDetail.overview}</Text>
            </View>
          </Modal>

          <View style={itemStyle}>
            <Text style={detailTitle}>Release Date: </Text>
            <Text style={detail}>{movieDetail.release_date}</Text>
          </View>

          <Text style={detailTitle}>Overview:</Text>
          <View style={itemStyle}>
            <Text style={overviewDetail}>
              {movieDetail.overview.length < 15 ? (
                `${movieDetail.overview} `
              ) : (
                <Fragment>
                  {movieDetail.overview.split(" ").slice(0, 15).join(" ")}
                  <Text onPress={handleShowMore} style={{ color: blue._2, fontSize: 20 }}>
                    {" more..."}
                  </Text>
                </Fragment>
              )}
            </Text>
          </View>

          <View style={{ height: movieReviewList === undefined || movieReviewList.length === 0 ? "auto" : 250, borderRadius: 10 }}>
            <Text style={detailTitle}>Review: </Text>
            <ScrollView bounces={false} nestedScrollEnabled={true}>
              {handleDisplayReview(movieReviewList)}
            </ScrollView>
          </View>

          <Modal animationType="fade" transparent={true} visible={showRate}>
            <TouchableWithoutFeedback
              onPress={() => {
                setShowRate(false);
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
                borderRadius: 8,
                borderWidth: 2,
                height: "auto",
                marginBottom: "auto",
                marginTop: "auto",
                padding: 8,
                width: "80%",
              }}>
              <Text style={detailTitle}>Rate the Movie </Text>
              <View style={ratingRow}>
                {ratingRange.map((item, index) => {
                  return (
                    <TouchableOpacity
                      style={{ borderRadius: 50, backgroundColor: white, padding: 2, margin: 1 }}
                      disabled={ratingSubmitted}
                      key={index}
                      onPress={() => handleSetRating(item)}>
                      <Image
                        style={ratingStar}
                        source={item <= rating ? require("./MovieDetail/filledStar.png") : require("./MovieDetail/nonFilledStar.png")}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
              <View style={{ width: 250, alignSelf: "center" }}>
                <TouchableOpacity onPress={handleSetRatingSubmitted} style={submitRatingButton}>
                  <Text style={{ width: 250, paddingVertical: 3, color: white, textAlign: "center", fontSize: 20 }}>
                    {ratingSubmitted ? "Delete Rating" : "Submit Rating"}
                  </Text>
                </TouchableOpacity>
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
