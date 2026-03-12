import { Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import {Pool} from "pg"



export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor(){
        console.log("DATABASE_URL:", process.env.DATABASE_URL)

        const connectionString = process.env.DATABASE_URL
        const pool = new Pool({connectionString}) 
        const adapter = new PrismaPg(pool)
        super({adapter,log:["error","warn"]})

    }

    async onModuleInit() {
        await this.$connect()
        Logger.log("Prisma connected✅")
    }

    async onModuleDestroy() {
        await this.$disconnect()
        Logger.log("❌Prisma disconnected")
    }
}
