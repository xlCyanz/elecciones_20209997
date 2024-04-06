import I18n from "i18n-js"

// Note the syntax of these imports from the date-fns library.
// If you import with the syntax: import { format } from "date-fns" the ENTIRE library
// will be included in your production bundle (even if you only use one function).
// This is because react-native does not support tree-shaking.
import { parse, type Locale } from "date-fns"
import format from "date-fns/format"
import parseISO from "date-fns/parseISO"
import es from "date-fns/locale/es"
import en from "date-fns/locale/en-US"

type Options = Parameters<typeof format>[2]
type OptionsParse = Parameters<typeof parse>[3]

const getLocale = (): Locale => {
  const locale = I18n.currentLocale().split("-")[0]
  return locale === "es" ? es : en;
}

export const formatDate = (date: string, dateFormat?: string, options?: Options) => {
  const locale = getLocale()
  const dateOptions = {
    ...options,
    locale,
  }
  return format(parseISO(date), dateFormat ?? "MMM dd, yyyy", dateOptions)
}

export const formatDateCustom = (date: Date, dateFormat?: string, options?: Options) => {
  const locale = getLocale()
  const dateOptions = {
    ...options,
    locale,
  }
  return format(date, dateFormat ?? "MMM dd, yyyy", dateOptions)
}

export const parseDate = (date: string, dateFormat?: string, options?: OptionsParse) => {
  const locale = getLocale()
  const dateOptions = {
    ...options,
    locale,
  }
  return parse(date, dateFormat ?? "MMM dd, yyyy", new Date(), dateOptions)
}
