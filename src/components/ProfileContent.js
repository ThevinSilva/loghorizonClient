import React from "react";

const ProfileContent = ({ data }) => {
  const {
    _id,
    username,
    firstName,
    lastName,
    createdAt,
    friendsList,
    boardList,
  } = data;

  return (
    <ul>
      <li class="collection-item info">
        <span>GOOGLE API ID</span> <p>{_id}</p>
      </li>
      <li class="collection-item info">
        <span>USER NAME</span> <p>{username}</p>
      </li>
      <li class="collection-item info">
        <span>FIRST MAME</span> <p>{firstName}</p>
      </li>
      <li class="collection-item info">
        <span>LAST NAME</span> <p>{lastName}</p>
      </li>
      <li class="collection-item info">
        <span>CREATED AT</span> <p>{createdAt}</p>
      </li>
      <li class="collection-item info">
        <span>NUMBER OF FRIENDS</span> <p>{friendsList.length}</p>
      </li>
      <li class="collection-item info">
        <span>NUMBER OF BOARDS </span> <p>{boardList.length}</p>
      </li>
    </ul>
  );
};

export default ProfileContent;
