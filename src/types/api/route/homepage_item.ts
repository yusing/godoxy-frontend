type HomepageItemMetadata = {
  alias: string;
  provider: string;
  url: string;
  skeleton?: boolean;
};

interface HomepageItem extends HomepageItemMetadata {
  show?: boolean;
  name: string;
  icon: string;
  category: string;
  description: string;
  sort_order?: number;
  widget_config?: {};
}

const randName = (length: number) => {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const DummyHomepageItem = (): HomepageItem => {
  return {
    show: true,
    name: randName(10),
    alias: randName(10),
    provider: randName(10),
    icon: "",
    category: randName(10),
    description: "",
    widget_config: {},
    url: "",
    skeleton: true,
  };
};

type HomepageItems = Record<string, HomepageItem[]>;

type HomepageItemsFilter = {
  category: string;
  provider: string;
};

export type { HomepageItem, HomepageItems, HomepageItemsFilter };
