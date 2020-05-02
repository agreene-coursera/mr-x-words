import { PlayerName } from "../types/PlayerName";

const playerToImage = {
  Austin:
    "https://scontent-sjc3-1.xx.fbcdn.net/v/t1.15752-9/94238554_639750663272940_8873059334368526336_n.jpg?_nc_cat=101&_nc_sid=b96e70&_nc_ohc=arj-dJq45mMAX98Uwwd&_nc_ht=scontent-sjc3-1.xx&oh=d84a3c7dee9a1f9c335368186c7e3f19&oe=5ED1D167",
  Sue:
    "https://scontent-sjc3-1.xx.fbcdn.net/v/t1.15752-9/93412113_684132849055526_8448952479487361024_n.jpg?_nc_cat=104&_nc_sid=b96e70&_nc_ohc=gh0csIXvYjgAX-4VEyi&_nc_ht=scontent-sjc3-1.xx&oh=28db33f743f756f67ec0b8262296ed87&oe=5EC37292&dl=1",
  Claire:
    "https://scontent-sjc3-1.xx.fbcdn.net/v/t1.15752-9/94251540_1567699563377790_8972617140146274304_n.jpg?_nc_cat=100&_nc_sid=b96e70&_nc_ohc=JjLlVQYUj2EAX_hOPaX&_nc_ht=scontent-sjc3-1.xx&oh=2322fd323a0b794b9dfd000d91f580bc&oe=5EC0CBED&dl=1",
  Alan:
    "https://scontent-sjc3-1.xx.fbcdn.net/v/t1.15752-9/93865598_236099684417597_7421800077007519744_n.jpg?_nc_cat=107&_nc_sid=b96e70&_nc_ohc=dZub4VYofSYAX8y-tMS&_nc_ht=scontent-sjc3-1.xx&oh=9cb204897a5b2fc5ba4d0d8aaf16fb46&oe=5EC2C71C&dl=1",
  Rachel:
    "https://scontent-sjc3-1.xx.fbcdn.net/v/t1.15752-9/93256856_596059404338727_15556539049836544_n.jpg?_nc_cat=108&_nc_sid=b96e70&_nc_ohc=h_BZvnFt41wAX8zojUP&_nc_ht=scontent-sjc3-1.xx&oh=91d9c91d6b2865d8a21ec97448c44405&oe=5EC41D4A&dl=1",
  Cheryl:
    "https://scontent-sjc3-1.xx.fbcdn.net/v/t1.15752-9/93886944_396091548032444_2963123363716792320_n.jpg?_nc_cat=105&_nc_sid=b96e70&_nc_ohc=Sj7yUp57TIsAX9Cg4R8&_nc_ht=scontent-sjc3-1.xx&oh=25e4e17680968c28cc36b53e5854f339&oe=5EC07B8A&dl=1",
  Beth:
    "https://scontent-sjc3-1.xx.fbcdn.net/v/t1.15752-9/93884245_258094318910211_1024276221795500032_n.jpg?_nc_cat=101&_nc_sid=b96e70&_nc_ohc=3EsHpGb9-DoAX-jjYqG&_nc_ht=scontent-sjc3-1.xx&oh=7a1a4d4c2f159ece7b7b82389befefbc&oe=5EC0CEC4&dl=1",
  Kevin:
    "https://scontent-sjc3-1.xx.fbcdn.net/v/t1.15752-9/93422664_240311363691591_260305078613704704_n.jpg?_nc_cat=106&_nc_sid=b96e70&_nc_ohc=DBaAgIUco9QAX8IEWQw&_nc_ht=scontent-sjc3-1.xx&oh=a9b33d55c472457e26e41fe6be05f98e&oe=5EC18E9B&dl=1",
  Garrett:
    "https://scontent-sjc3-1.xx.fbcdn.net/v/t1.15752-9/93776990_1001472520247359_5207100671861456896_n.jpg?_nc_cat=104&_nc_sid=b96e70&_nc_ohc=u2QgefkxbRYAX8jiV2E&_nc_ht=scontent-sjc3-1.xx&oh=e28eea8a3a26faf1f5189ac3bdf2d04a&oe=5EC447D7&dl=1",
  Scott:
    "https://scontent-sjc3-1.xx.fbcdn.net/v/t1.15752-9/93962843_261307035269812_3761977866204479488_n.jpg?_nc_cat=104&_nc_sid=b96e70&_nc_ohc=GUKBZc0qSXYAX9Dmmj_&_nc_ht=scontent-sjc3-1.xx&oh=72a80ee0f376a1ae55437b73deff15ba&oe=5EC431E5&dl=1",
};

export default (name: PlayerName | undefined): string | undefined =>
  name && playerToImage[name];
