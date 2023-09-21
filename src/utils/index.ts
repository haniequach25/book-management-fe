export const formatPhoneNumber = (phoneNumber?: string, spliter?: string) => {
  const x = phoneNumber && phoneNumber.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
  return !!x?.length
    ? !x[2]
      ? x[1]
      : `${x[1]} ${spliter || '-'} ${x[2]}${x[3] ? ` ${spliter || '-'} ${x[3]}` : ''}`
    : '';
};

export const formatNumberThousand = (numberThousand: string | number, spliter?: string) => {
  return numberThousand.toString().replace(/\B(?=(\d{3})+(?!\d))/g, spliter || ',');
};
