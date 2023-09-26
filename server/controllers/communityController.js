import fs from 'fs/promises';
import path from 'path';

import cloudinary from 'cloudinary';

import asyncHandler from '../middlewares/asyncHandler.middleware.js';
import AppError from '../utils/AppError.js';
import Community from "../models/communityModel.js";

export const getAllCommunities = asyncHandler(async (_req, res, next) => {
    const community = await Community.find({})

    res.status(200).json({
        success: true,
        message: 'All communities',
        community,
    });
});


export const joinCommunity = asyncHandler(async (req, res, next) => {
    try {
        const { communityId } = req.body;
        const community = await Community.findById(communityId);

        if (!community) {
            return next(new AppError('Community not found', 404));
        }

        const userId = req.user.id;
        if (community.members.includes(userId)) {
            return next(new AppError('You are already a member of this community', 400));
        }

        community.members.push(userId);
        await community.save();

        res.status(200).json({
            success: true,
            message: 'You have joined the community!',
            community: community
        });
    } catch (e) {
        return next(new AppError(e.message, 500));
    }
})

export const exitCommunity = asyncHandler(async (req, res, next) => {
    try {
        const { communityId } = req.params;
        const community = await Community.findById(communityId);

        if (!community) {
            return next(new AppError('Community not found', 404));
        }

        const userId = req.user.id;
        if (!community.members.includes(userId)) {
            return next(new AppError('You are not a member of this community', 400));
        }

        community.members = community.members.filter(memberId => memberId.toString() !== userId.toString());
        await community.save();

        res.status(200).json({
            success: true,
            message: 'You have exited the community!',
            community: community
        });
    } catch (e) {
        return next(new AppError(e.message, 500));
    }
})

export const createCommunity = asyncHandler(async (req, res, next) => {
    const { name, description } = req.body;

    if (!name || !description) {
        return next(new AppError('All fields are required', 400));
    }

    const community = await Community.create({
        name,
        description
    });

    if (!community) {
        return next(
            new AppError('Community could not be created, please try again', 400)
        );
    }

    if (req.file) {
        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'lms',
            });

            if (result) {
                community.thumbnail.public_id = result.public_id;
                community.thumbnail.secure_url = result.secure_url;
            }

            fs.rm(`uploads/${req.file.filename}`);
        } catch (error) {
            for (const file of await fs.readdir('uploads/')) {
                await fs.unlink(path.join('uploads/', file));
            }

            return next(
                new AppError(
                    JSON.stringify(error) || 'File not uploaded, please try again',
                    400
                )
            );
        }
    }

    await community.save();

    res.status(201).json({
        success: true,
        message: 'Community created successfully',
        community,
    });
});

export const updateCommunity = asyncHandler(async (req, res, next) => {
    const { communityId } = req.params;
    console.log(communityId)
    const community = await Community.findByIdAndUpdate(
        communityId,
        {
            $set: req.body,
        },
        {
            runValidators: true,
        }
    );

    if (!community) {
        return next(new AppError('Invalid community id or community not found.', 400));
    }

    res.status(200).json({
        success: true,
        message: 'Community updated successfully',
    });
});


export const deleteCommunity = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const community = await Community.findByIdAndDelete(id);

    if (!community) {
        return next(new AppError('Community with given id does not exist.', 404));
    }

    await community.remove();

    res.status(200).json({
        success: true,
        message: 'Community deleted successfully',
    });
});
