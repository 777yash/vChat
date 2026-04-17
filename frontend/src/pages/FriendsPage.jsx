import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  getUserFriends,
  getFriendRequests,
  getOutgoingFriendReqs,
  acceptFriendRequest,
  removeFriend,
} from "../lib/api";
import { Link } from "react-router";
import {
  SearchIcon,
  UserMinusIcon,
  MessageSquareIcon,
  CheckCircleIcon,
  ClockIcon,
  UsersIcon,
  UserPlusIcon,
  XIcon,
} from "lucide-react";
import { capitialize } from "../lib/utils";
import { getLanguageFlag } from "../components/FriendCard";
import toast from "react-hot-toast";

const FriendsPage = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // "all" | "pending" | "outgoing"

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: friendRequests, isLoading: loadingRequests } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { data: outgoingReqs = [], isLoading: loadingOutgoing } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: acceptMutation } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      toast.success("Friend request accepted!");
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
    onError: () => toast.error("Failed to accept request"),
  });

  const { mutate: unfriendMutation, isPending: isUnfriending } = useMutation({
    mutationFn: removeFriend,
    onSuccess: () => {
      toast.success("Friend removed");
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
    onError: () => toast.error("Failed to remove friend"),
  });

  const incomingReqs = friendRequests?.incomingReqs || [];

  const filteredFriends = friends.filter((friend) =>
    friend.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingCount = incomingReqs.length;
  const outgoingCount = outgoingReqs.length;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3">
              <UsersIcon className="size-8 text-primary" />
              Friends
            </h1>
            <p className="text-base-content/60 mt-1">
              {friends.length} friend{friends.length !== 1 ? "s" : ""} total
            </p>
          </div>
          <Link to="/" className="btn btn-primary btn-sm gap-2">
            <UserPlusIcon className="size-4" />
            Find New Friends
          </Link>
        </div>

        {/* TABS */}
        <div className="tabs tabs-boxed bg-base-200 p-1 w-fit">
          <button
            className={`tab ${activeTab === "all" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All Friends
            <span className="badge badge-sm ml-2">{friends.length}</span>
          </button>
          <button
            className={`tab ${activeTab === "pending" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            Incoming
            {pendingCount > 0 && (
              <span className="badge badge-sm badge-primary ml-2">{pendingCount}</span>
            )}
          </button>
          <button
            className={`tab ${activeTab === "outgoing" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("outgoing")}
          >
            Outgoing
            {outgoingCount > 0 && (
              <span className="badge badge-sm badge-secondary ml-2">{outgoingCount}</span>
            )}
          </button>
        </div>

        {/* ALL FRIENDS TAB */}
        {activeTab === "all" && (
          <div className="space-y-6">
            {/* SEARCH */}
            <div className="relative max-w-md">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-base-content/40" />
              <input
                type="text"
                placeholder="Search friends by name..."
                className="input input-bordered w-full pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="btn btn-ghost btn-circle btn-sm absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setSearchQuery("")}
                >
                  <XIcon className="size-4" />
                </button>
              )}
            </div>

            {loadingFriends ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card bg-base-200 animate-pulse">
                    <div className="card-body p-5">
                      <div className="flex items-center gap-3">
                        <div className="size-14 rounded-full bg-base-300" />
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-base-300 rounded w-24" />
                          <div className="h-3 bg-base-300 rounded w-16" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredFriends.length === 0 ? (
              <div className="card bg-base-200 p-8 text-center">
                <UsersIcon className="size-12 mx-auto text-base-content/30 mb-3" />
                <h3 className="font-semibold text-lg mb-1">
                  {searchQuery ? "No friends match your search" : "No friends yet"}
                </h3>
                <p className="text-base-content/60">
                  {searchQuery
                    ? "Try a different search term"
                    : "Start connecting with language learners from the home page!"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFriends.map((friend) => (
                  <div
                    key={friend._id}
                    className="card bg-base-200 hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="card-body p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="avatar">
                          <div className="size-14 rounded-full ring ring-base-300 ring-offset-base-100 ring-offset-2">
                            <img src={friend.profilePic} alt={friend.fullName} />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg truncate">{friend.fullName}</h3>
                        </div>
                      </div>

                      {/* Languages */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        <span className="badge badge-secondary badge-sm">
                          {getLanguageFlag(friend.nativeLanguage)}
                          Native: {capitialize(friend.nativeLanguage || "")}
                        </span>
                        <span className="badge badge-outline badge-sm">
                          {getLanguageFlag(friend.learningLanguage)}
                          Learning: {capitialize(friend.learningLanguage || "")}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Link
                          to={`/chat/${friend._id}`}
                          className="btn btn-primary btn-sm flex-1 gap-1"
                        >
                          <MessageSquareIcon className="size-4" />
                          Message
                        </Link>
                        <button
                          className="btn btn-ghost btn-sm text-error hover:bg-error/10"
                          onClick={() => unfriendMutation(friend._id)}
                          disabled={isUnfriending}
                          title="Remove friend"
                        >
                          <UserMinusIcon className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* INCOMING REQUESTS TAB */}
        {activeTab === "pending" && (
          <div className="space-y-4">
            {loadingRequests ? (
              <div className="flex justify-center py-12">
                <span className="loading loading-spinner loading-lg" />
              </div>
            ) : incomingReqs.length === 0 ? (
              <div className="card bg-base-200 p-8 text-center">
                <ClockIcon className="size-12 mx-auto text-base-content/30 mb-3" />
                <h3 className="font-semibold text-lg mb-1">No pending requests</h3>
                <p className="text-base-content/60">
                  When someone sends you a friend request, it will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {incomingReqs.map((req) => (
                  <div
                    key={req._id}
                    className="card bg-base-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="card-body p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="avatar">
                          <div className="size-14 rounded-full">
                            <img src={req.sender.profilePic} alt={req.sender.fullName} />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{req.sender.fullName}</h3>
                          <p className="text-xs text-base-content/50">Wants to be your friend</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-3">
                        <span className="badge badge-secondary badge-sm">
                          {getLanguageFlag(req.sender.nativeLanguage)}
                          Native: {capitialize(req.sender.nativeLanguage || "")}
                        </span>
                        <span className="badge badge-outline badge-sm">
                          {getLanguageFlag(req.sender.learningLanguage)}
                          Learning: {capitialize(req.sender.learningLanguage || "")}
                        </span>
                      </div>

                      <button
                        className="btn btn-success btn-sm w-full gap-1"
                        onClick={() => acceptMutation(req._id)}
                      >
                        <CheckCircleIcon className="size-4" />
                        Accept Request
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* OUTGOING REQUESTS TAB */}
        {activeTab === "outgoing" && (
          <div className="space-y-4">
            {loadingOutgoing ? (
              <div className="flex justify-center py-12">
                <span className="loading loading-spinner loading-lg" />
              </div>
            ) : outgoingReqs.length === 0 ? (
              <div className="card bg-base-200 p-8 text-center">
                <ClockIcon className="size-12 mx-auto text-base-content/30 mb-3" />
                <h3 className="font-semibold text-lg mb-1">No outgoing requests</h3>
                <p className="text-base-content/60">
                  Friend requests you send will appear here until accepted.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {outgoingReqs.map((req) => (
                  <div
                    key={req._id}
                    className="card bg-base-200 transition-all duration-300"
                  >
                    <div className="card-body p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="avatar">
                          <div className="size-14 rounded-full opacity-75">
                            <img src={req.recipient.profilePic} alt={req.recipient.fullName} />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{req.recipient.fullName}</h3>
                          <p className="text-xs text-warning flex items-center gap-1">
                            <ClockIcon className="size-3" />
                            Pending
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        <span className="badge badge-secondary badge-sm">
                          {getLanguageFlag(req.recipient.nativeLanguage)}
                          Native: {capitialize(req.recipient.nativeLanguage || "")}
                        </span>
                        <span className="badge badge-outline badge-sm">
                          {getLanguageFlag(req.recipient.learningLanguage)}
                          Learning: {capitialize(req.recipient.learningLanguage || "")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;
