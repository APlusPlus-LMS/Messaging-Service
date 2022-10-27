import { Router } from "express";
import { ChannelModel, IMessage } from "../database/schema.js";

const router = Router();

// TODO: Auth (fetch token from headers, extract user id from it, check if user id is present in channel.members)
router.route("/messages/:channelId")
    .get((req, res) => {
        ChannelModel.findById(req.params.channelId)
            .then(channel => {
                if (channel === null) {
                    return res.status(404).send("Not found.");
                }

                const page = parseInt(req.query.page?.toString() || "0");

                const startVal = 0 + 50 * page;

                if (startVal > channel.messages.length) {
                    // Preprocess this as to save operations. If we're beyond the length, there's nothing to return.
                    return res.status(200).send([]);
                }

                // Otherwise, we need to calculate the end val. By default, we use page lengths of 50
                let endVal = 49 + 50 * page;

                // We don't want to send undefined values, so we'll simply cut the end short if we go over length
                if (endVal > channel.messages.length) {
                    endVal = channel.messages.length;
                }

                return res.status(200).send(channel.messages.slice(startVal, endVal));
            })
            .catch(err => {
                console.error(err);
                return res.status(500).send(err);
            });
    })

    // TODO: Auth, use jwt to encode uid
    .post((req, res) => {
        ChannelModel.findById(req.params.channelId)
            .then(channel => {
                if (channel === null) {
                    return res.status(404).send("Not found.");
                }

                // Validate body
                if (req.body.content === undefined) {
                    return res.status(400).send("Missing message body.");
                }
                else if (req.body.authorId === undefined) {
                    return res.status(401).send("You are not authorized to send messages to this channel.");
                }

                const message: IMessage = {
                    authorId: req.body.authorId,
                    channelId: req.params.channelId,
                    content: req.body.content,
                    sentTime: new Date(),
                    isEdited: false
                };

                channel.messages.push(message);

                channel.save()
                    .then(() => {
                        return res.status(201).send(message);
                    })
                    .catch(err => {
                        console.error(err);
                        return res.status(500).send(err);
                    });
            })
            .catch(err => {
                console.error(err);
                return res.status(500).send(err);
            });
    });

export { router };
