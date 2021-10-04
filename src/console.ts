import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/services/users.service';


async function bootstrap() {
  const application = await NestFactory.createApplicationContext(
    AppModule,
  );

  const command = process.argv[2];

  switch (command) {

    case 'create-user-movies':
      const usersService = application.get(UsersService);
      await usersService.createMoviesWithUser({ email: "admin@admin.com", password: 'Eebf9742200#' }).then(() => {
        console.log('User: admin@admin.com, password:Eebf9742200# added with 20 public elements')
      }).catch(() => console.log('Sorry you can not preFill the DDBB, please create a user and enter in the dashboard to create public elements'));
      break;
    default:
      console.log('Command not found');
      process.exit(1);
  }

  await application.close();
  process.exit(0);
}

bootstrap();
