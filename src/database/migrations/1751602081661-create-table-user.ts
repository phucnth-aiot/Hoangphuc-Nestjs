import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableUser1751602081661 implements MigrationInterface {
    name = 'CreateTableUser1751602081661'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`User\` (\`userid\` varchar(36) NOT NULL, \`username\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`role\` varchar(255) NULL, \`avatarUrl\` varchar(255) NULL, \`refreshToken\` varchar(255) NULL, PRIMARY KEY (\`userid\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`User\``);
    }

}
