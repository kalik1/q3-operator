enum Mods {
  Base = 'base',
  Osp = 'osp',
}

const ModPacks: Record<
  Mods,
  { fileName: string; name: string; destPath: string; uri: string }[]
> = {
  base: [
    {
      name: 'pak0',
      fileName: 'pak0.pk3',
      destPath: 'baseq3',
      uri: 'https://raw.githubusercontent.com/nrempel/q3-server/master/baseq3/pak0.pk3',
    },
  ],
  osp: [
    {
      name: 'pak0',
      fileName: 'pak0.pk3',
      destPath: 'baseq3',
      uri: 'https://raw.githubusercontent.com/nrempel/q3-server/master/baseq3/pak0.pk3',
    },
    {
      name: 'osp-103a',
      fileName: 'osp-Quake3-1.03a_full.zip',
      destPath: '',
      uri: 'http://osp.dget.cc/orangesmoothie/downloads/osp-Quake3-1.03a_full.zip',
    },
  ],
};

export { Mods, ModPacks };
