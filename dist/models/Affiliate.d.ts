import { Model, Optional } from 'sequelize';
export declare enum AffiliateRole {
    ADMIN = "ADMIN",
    MANAGER = "MANAGER",
    AFFILIATE = "AFFILIATE"
}
export type AffiliateStatus = 'active' | 'inactive' | 'suspended';
export interface AffiliateAttributes {
    id: string;
    parent_id: string | null;
    name: string;
    email: string;
    access_code: string;
    role: AffiliateRole;
    password: string | null;
    verified: boolean;
    wallet_address: string | null;
    path: string;
    tag: string | null;
    status: AffiliateStatus;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}
export interface AffiliateCreationAttributes extends Optional<AffiliateAttributes, 'id' | 'parent_id' | 'password' | 'wallet_address' | 'tag' | 'path'> {
}
declare const Affiliate: import("sequelize").ModelCtor<Model<AffiliateAttributes, AffiliateCreationAttributes>>;
export default Affiliate;
