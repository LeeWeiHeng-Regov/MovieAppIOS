import React, { Fragment, FunctionComponent, useContext, useEffect, useState } from "react";
import { Alert, Dimensions, Image, ImageStyle, SafeAreaView, ScrollView, StatusBar, Text, TextStyle, View, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

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
    color: "#A200FF",
    flexWrap: "wrap",
    width: "90%",
    // marginLeft: 10,
  };

  const detailTitle: TextStyle = {
    // color: "#FFFF00",
    color: "lightgreen",
    fontSize: 20,
    fontWeight: "bold",
  };

  const detail: TextStyle = {
    color: "#FFFF00",
    fontSize: 20,
  };

  const itemStyle: ViewStyle = {
    flexDirection: "row",
    flexWrap: "wrap",
  };

  const overviewDetail: TextStyle = {
    color: "yellow",
    fontSize: 18,
    lineHeight: 20,
  };

  const movieReviewCard: ViewStyle = {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
    backgroundColor: "#CFC136",
  };

  const reviewAuthor: TextStyle = {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
  };

  const reviewContent: TextStyle = {
    color: "black",
    fontSize: 15,
  };

  const ratingRow: ViewStyle = {
    flexDirection: "row",
    backgroundColor: "grey",
    borderRadius: 10,
    marginBottom: 10,
  };

  const ratingStar: ImageStyle = {
    height: (Dimensions.get("screen").width - 20) / 10,
    width: (Dimensions.get("screen").width - 20) / 10,
    resizeMode: "stretch",
  };

  const submitRatingButton: ViewStyle = {
    borderWidth: 2,
    borderRadius: 10,
    // flexWrap: "wrap",
    ...justifyCenter,
    ...alignCenter,
    alignSelf: "center",
    backgroundColor: ratingSubmitted ? "red" : "blue",
    marginBottom: 5,
    width: 250,
  };

  const handleDisplayReview = (movieReviewList: IMovieReview[] | undefined) => {
    if (movieReviewList === undefined) {
      return <Text style={{ color: "white" }}>Loading...</Text>;
    } else if (movieReviewList !== undefined && movieReviewList.length === 0) {
      return <Text style={{ color: "white" }}>No Review for this movie yet</Text>;
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
    <SafeAreaView style={{ backgroundColor: "black" }}>
      <StatusBar barStyle={"light-content"} />
      {movieDetail !== undefined ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          style={{ height: "100%", backgroundColor: "black", paddingHorizontal: 10, paddingTop: 4, paddingBottom: 80, borderRadius: 8 }}>
          <Image
            source={{ uri: `${getImageUrl}${movieDetail.poster_path}` }}
            resizeMode="stretch"
            style={{ height: (Dimensions.get("window").width - 20) * 1.618, width: "100%", borderRadius: 64 }} // 1.618 is golden ratio
          />
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={movieTitle}>{movieDetail.title}</Text>
            <TouchableOpacity style={{ backgroundColor: "yellow", marginTop: 5 }} onPress={handleAddedWatchList}>
              <Image
                source={addedWatchList ? require("./MovieDetail/filledBookmark.png") : require("../asset/nonFilledBookmark.png")}
                style={{ height: 30, width: 30, resizeMode: "stretch", marginLeft: 2 }}
              />
            </TouchableOpacity>
          </View>

          <View style={itemStyle}>
            <Text style={detailTitle}>Language: </Text>
            <Text style={detail}>{movieDetail.original_language}</Text>
            <Text style={{ ...detailTitle, marginLeft: "auto" }}>Rating: </Text>
            <Text style={{ ...detail, marginRight: "auto" }}>{movieDetail.vote_average}</Text>
          </View>

          <View style={itemStyle}>
            <Text style={detailTitle}>Release Date: </Text>
            <Text style={detail}>{movieDetail.release_date}</Text>
          </View>

          <Text style={detailTitle}>Overview:</Text>
          <ScrollView nestedScrollEnabled={true} style={{ minHeight: showMore ? 100 : 60, maxHeight: showMore ? 100 : 60 }}>
            <View style={itemStyle}>
              <Text style={overviewDetail}>
                {movieDetail.overview.length < 15 ? (
                  `${movieDetail.overview} `
                ) : (
                  <Fragment>
                    {!showMore ? movieDetail.overview.split(" ").slice(0, 15).join(" ") : `${movieDetail.overview}`}

                    <Text onPress={handleShowMore} style={{ color: "#0049FF", fontSize: 20 }}>
                      {showMore ? " less..." : " more..."}
                    </Text>
                  </Fragment>
                )}
              </Text>
            </View>
          </ScrollView>

          <View style={{ height: movieReviewList === undefined || movieReviewList.length === 0 ? "auto" : 250, borderRadius: 10 }}>
            <Text style={detailTitle}>Review: </Text>
            <ScrollView nestedScrollEnabled={true}>{handleDisplayReview(movieReviewList)}</ScrollView>
          </View>

          <View style={{ height: "30%", marginTop: 5 }}>
            <Text style={detailTitle}>Rate the Movie: </Text>
            <View style={ratingRow}>
              {ratingRange.map((item, index) => {
                return (
                  <TouchableOpacity disabled={ratingSubmitted} key={index} onPress={() => handleSetRating(item)}>
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
                <Text style={{ width: 250, paddingVertical: 3, color: "white", textAlign: "center", fontSize: 20 }}>
                  {ratingSubmitted ? "Delete Rating" : "Submit Rating"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      ) : (
        <Text>Loading...</Text>
      )}
    </SafeAreaView>
  );
};
