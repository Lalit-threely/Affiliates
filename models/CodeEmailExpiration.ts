import { Model, DataTypes } from 'sequelize';
import { sequelize } from './index'; // Ensure the correct path to your sequelize instance

// Define the interface for the model attributes
interface CodeEmailExpirationAttributes {
  id?: number;
  email: string;
  code: string;
  expiration_time: Date;
  createdAt?: Date; // Optional timestamps
  updatedAt?: Date;
}

class CodeEmailExpiration
  extends Model<CodeEmailExpirationAttributes>
  implements CodeEmailExpirationAttributes
{
  public id!: number;
  public email!: string;
  public code!: string;
  public expiration_time!: Date;
  public createdAt?: Date;
  public updatedAt?: Date;

  // Optionally, you can add virtual fields, timestamps, etc.
}

CodeEmailExpiration.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Enforcing unique email per code
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiration_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize, // Pass the sequelize instance
    modelName: 'CodeEmailExpiration',
    tableName: 'code_email_expirations', // Define the table name
    timestamps: true, // Adds createdAt and updatedAt automatically
    paranoid: false, // Soft deletes
    indexes: [
      {
        unique: true,
        fields: ['email'], // Index on email to enforce uniqueness
      },
    ],
  }
);

export default CodeEmailExpiration;
