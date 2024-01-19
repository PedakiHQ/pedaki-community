// Adapted from: https://github.com/aiji42/zod-i18n/blob/main/packages/core/locales/fr/zod.json
/*
MIT License

Copyright (c) 2021 AijiUejima

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
Footer
*/
export default {
  errors: {
    invalid_type: 'Le type « {expected} » est attendu mais « {received} » a été reçu',
    invalid_type_received_undefined: 'Obligatoire',
    invalid_literal: 'La valeur doit être {expected}',
    unrecognized_keys: "Une ou plusieurs clé(s) non reconnue(s) dans l'objet : {keys}",
    invalid_union: 'Champ non valide',
    invalid_union_discriminator:
      'La valeur du discriminateur est non valide. Options attendues : {options}',
    invalid_enum_value: "La valeur « {received} » n'existe pas dans les options : {options}",
    invalid_arguments: 'Les arguments de la fonction sont non valides',
    invalid_return_type: "Le type de retour de la fonction n'est pas valide",
    invalid_date: 'La date est non valide',
    custom: 'Champ non valide',
    invalid_intersection_types: "Les résultats d'intersection n'ont pas pu être fusionnés",
    not_multiple_of: 'Le nombre doit être un multiple de {multipleOf}',
    not_finite: 'Le nombre doit être fini',
    invalid_string: {
      email: "L'{validation} n'est pas valide",
      url: '{validation} non valide',
      ulid: '{validation} non valide',
      uuid: '{validation} non valide',
      cuid: '{validation} non valide',
      cuid2: '{validation} non valide',
      regex: '{validation} non valide',
      emoji: '{validation} non valide',
      ip: '{validation} non valide',
      datetime: '{validation} non valide',
      startsWith: 'Le champ doit commencer par « {startsWith} »',
      endsWith: 'Le champ doit se terminer par « {endsWith} »',
    },
    too_small: {
      array: {
        exact: 'La liste doit contenir exactement {minimum} élément(s)',
        inclusive: 'La liste doit contenir au moins {minimum} élément(s)',
        not_inclusive: 'La liste doit contenir plus de {minimum} élément(s)',
      },
      string: {
        exact: 'La chaîne doit contenir exactement {minimum} caractère(s)',
        inclusive: 'La chaîne doit contenir au moins {minimum} caractère(s)',
        not_inclusive: 'La chaîne doit contenir plus de {minimum} caractère(s)',
      },
      number: {
        exact: 'Le nombre doit être égal à {minimum}',
        inclusive: 'Le nombre doit être supérieur ou égal à {minimum}',
        not_inclusive: 'Le nombre doit être supérieur à {minimum}',
      },
      bigint: {
        exact: 'Le nombre doit être égal à {minimum}',
        inclusive: 'Le nombre doit être supérieur ou égal à {minimum}',
        not_inclusive: 'Le nombre doit être supérieur à {minimum}',
      },
      set: {
        exact: 'Champ non valide',
        inclusive: 'Champ non valide',
        not_inclusive: 'Champ non valide',
      },
      date: {
        exact: 'Champ non valide',
        inclusive: 'Champ non valide',
        not_inclusive: 'Champ non valide',
      },
    },
    too_big: {
      array: {
        exact: 'La liste doit contenir exactement {maximum} élément(s)',
        inclusive: 'La liste doit contenir au plus {maximum} élément(s)',
        not_inclusive: 'La liste doit contenir moins de {maximum} élément(s)',
      },
      string: {
        exact: 'La chaîne doit contenir exactement {maximum} caractère(s)',
        inclusive: 'La chaîne doit contenir au plus {maximum} caractère(s)',
        not_inclusive: 'La chaîne doit contenir moins de {maximum} caractère(s)',
      },
      number: {
        exact: 'Le nombre doit être égal à {maximum}',
        inclusive: 'Le nombre doit être inférieur ou égal à {maximum}',
        not_inclusive: 'Le nombre doit être inférieur à {maximum}',
      },
      bigint: {
        exact: 'Le nombre doit être égal à {maximum}',
        inclusive: 'Le nombre doit être inférieur ou égal à {maximum}',
        not_inclusive: 'Le nombre doit être inférieur à {maximum}',
      },
      set: {
        exact: 'Champ non valide',
        inclusive: 'Champ non valide',
        not_inclusive: 'Champ non valide',
      },
      date: {
        exact: 'Champ non valide',
        inclusive: 'Champ non valide',
        not_inclusive: 'Champ non valide',
      },
    },
  },
  validations: {
    email: 'email',
    url: 'lien',
    ulid: 'ulid',
    uuid: 'UUID',
    cuid: 'CUID',
    cuid2: 'cuid2',
    emoji: 'emoji',
    ip: 'ip',
    regex: 'expression régulière',
    datetime: 'date',
  },
  types: {
    function: 'fonction',
    number: 'nombre',
    string: 'chaîne de caractères',
    nan: 'NaN',
    integer: 'entier',
    float: 'décimal',
    boolean: 'booléen',
    date: 'date',
    bigint: 'grand entier',
    undefined: 'undefined',
    symbol: 'symbole',
    null: 'null',
    array: 'liste',
    object: 'objet',
    unknown: 'inconnu',
    promise: 'promise',
    void: 'void',
    never: 'never',
    map: 'map',
    set: 'ensemble',
  },
  custom: {
    name: {
      required: 'Le nom est requis',
    },
    password: {
      required: 'Le mot de passe est requis',
      min: 'Le mot de passe doit contenir au moins {count} caractères',
    },
    passwordConfirm: {
      required: 'La confirmation de mot de passe est requise',
      unmatched: 'Les mots de passe ne correspondent pas',
    },
    file: {
      mustBeImage: "L'image doit être au format PNG ou JPG.",
      size: 'Le fichier doit être inférieur à {size}.',
    },
  },
} as const;
