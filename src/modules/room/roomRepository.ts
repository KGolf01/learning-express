import { Prisma, Room } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';
import prisma from '@src/db';
import { TypeCreateRoom } from './roomModal';

export const Keys = ['id', 'roomName', 'createdAt', 'updatedAt', 'createdBy', 'student'];

export const roomRepository = {
  findAllAsync: async <Key extends keyof Room>({
    page,
    size,
    keys = Keys as Key[],
  }: {
    page: number;
    size: number;
    keys?: Key[];
  }) => {
    const perPage = size;
    const paginate = createPaginator({ perPage: perPage });
    return await paginate<Room, Prisma.RoomFindManyArgs>(
      prisma.room,
      {
        // select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
        include: {
          messages: true,
        },
      },
      { page: page }
    );
  },

  findByIdAsync: async <Key extends keyof Room>(id: string, keys = Keys as Key[]) => {
    return prisma.room.findUnique({
      where: {
        id: id,
      },
      include: {
        messages: {
          include: {
            user: true
          }
        }
        
      },
      // select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    }) as Promise<Pick<Room, Key> | null>;
  },

  // findByRoomNameAsync: async <Key extends keyof Room>(roomName: string, keys = Keys as Key[]) => {
  //   return prisma.room.findUnique({
  //     where: { roomName: roomName },
  //     select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
  //   }) as Promise<Pick<Room, Key> | null>;
  // },
  create: async (userId: string, payload: TypeCreateRoom) => {
    const setPayload = {
      roomName: payload.body.roomName,
      createdBy: userId,
    };
    return prisma.room.create({
      data: setPayload,
    });
  },
};
