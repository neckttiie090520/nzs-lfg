/**
 * Share command metadata from a common spot to be used for both runtime
 * and registration.
 */

export const LFG_COMMAND = {
  name: "lfg",
  description: "เริ่มกล่องโต้ตอบ เพื่อหาทีม.",
  type: 1,
  options: [
    {
      name: "game",
      description: "ชื่อเกมที่คุณกำลังมองหาคนเล่นด้วย.",
      type: 3,
      required: true,
    },
    {
      name: "time",
      description:
        "จำนวนนาทีก่อนที่คุณจะเริ่มเล่นเกม. หรือจะใช้ 'now' เพื่อเริ่มเล่นตอนนี้เลย.",
      type: 3,
      required: false,
    },
    {
      name: "mention",
      description: "กล่าวถึงผู้ใช้และบทบาทที่คุณต้องการให้เห็นข้อความ.",
      type: 3,
      required: false,
    },
    {
      name: "datetime",
      description:
        "This accepts valid javascript datetimes for when you want to play e.g. 2024-04-15T12:00:00Z.",
      type: 3,
      required: false,
    },
  ],
};

export const INVITE_COMMAND = {
  name: "invite",
  description: "Get an inviteManager link to add the bot to your server.",
};

export const JOIN_GROUP_COMMAND = {
  name: "join-group",
  description: "Joins the user's group message.",
};

export const LEAVE_GROUP_COMMAND = {
  name: "leave-group",
  description: "Leave the user's group message.",
};
