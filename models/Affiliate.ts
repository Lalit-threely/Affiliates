import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from './index';
import { v4 as uuidv4 } from 'uuid';

export enum AffiliateRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  AFFILIATE = 'AFFILIATE',
  COMMUNITY_HEAD = 'COMMUNITY_HEAD'
}

export type AffiliateStatus = 'active' | 'inactive' | 'suspended';

export interface AffiliateAttributes {
  id: string;
  parent_id: string | null;
  name: string;
  tria_name?: string;
  email: string;
  access_code: string;
  role: AffiliateRole;
  password: string | null;
  verified?: boolean;
  path: string;
  tag: string | null;
  status?: AffiliateStatus;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface AffiliateCreationAttributes extends Optional<AffiliateAttributes, 'id' | 'parent_id' | 'password' | 'tag' | 'path'> {}

const Affiliate = sequelize.define<Model<AffiliateAttributes, AffiliateCreationAttributes>>(
  'Affiliate',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    parent_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tria_name: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    access_code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(AffiliateRole)),
      allowNull: false,
      defaultValue: AffiliateRole.AFFILIATE,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tag: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended'),
      allowNull: false,
      defaultValue: 'inactive',
    },
  },
  {
    tableName: 'Affiliates',
    timestamps: true,
    paranoid: true,
  }
);

// Hooks
Affiliate.beforeCreate(async (affiliate: Model<AffiliateAttributes, AffiliateCreationAttributes>, options: any) => {
  try {
    const affiliateData = affiliate.get();
    if (affiliateData.parent_id) {
      const parent = await Affiliate.findByPk(affiliateData.parent_id);
      if (!parent) {
        throw new Error(`Parent affiliate with ID ${affiliateData.parent_id} not found.`);
      }
      const parentData = parent.get();
      affiliate.set('path', `${parentData.path}/${affiliateData.id}`);
    } else {
      affiliate.set('path', `/${affiliateData.id}`);
    }
  } catch (error) {
    console.error('Error in beforeCreate hook for Affiliate model:', {
      affiliate: affiliate.get(),
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
});

export default Affiliate; 