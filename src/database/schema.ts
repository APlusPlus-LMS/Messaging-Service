import { model, Schema } from "mongoose";
import paginate from "mongoose-paginate-v2";

export interface IMessage {
    authorId: string,
    channelId: string,
    content: string,
    sentTime: Date,
    isEdited: boolean
}

export interface IChannel {
    name: string,
    messages: IMessage[],
    members: string[] // user ids of members in this channel
}

const messageSchema = new Schema<IMessage>({
    authorId: String,
    channelId: String,
    content: String,
    sentTime: Date,
    isEdited: Boolean
});
messageSchema.plugin(paginate);
export { messageSchema };

const channelSchema = new Schema<IChannel>({
    name: String,
    messages: [messageSchema],
    members: [String]
});
channelSchema.plugin(paginate);
export { channelSchema };

export const ChannelModel = model<IChannel>("Channel", channelSchema);
